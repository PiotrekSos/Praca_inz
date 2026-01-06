import React, { useMemo } from "react";
import type { Connection, Block } from "../types";
import { getInputPinPosition, getOutputPinPosition } from "../pinPositions";

interface JunctionsProps {
	connections: Connection[];
	blocks: Block[];
	showColors: boolean;
}

function isPointOnSegment(
	p: { x: number; y: number },
	a: { x: number; y: number },
	b: { x: number; y: number }
) {
	const CROSS_TOLERANCE = 0.5;

	const minX = Math.min(a.x, b.x) - CROSS_TOLERANCE;
	const maxX = Math.max(a.x, b.x) + CROSS_TOLERANCE;
	const minY = Math.min(a.y, b.y) - CROSS_TOLERANCE;
	const maxY = Math.max(a.y, b.y) + CROSS_TOLERANCE;

	if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
		return false;
	}

	if (Math.abs(a.x - b.x) < CROSS_TOLERANCE) {
		return Math.abs(p.x - a.x) < CROSS_TOLERANCE;
	}
	if (Math.abs(a.y - b.y) < CROSS_TOLERANCE) {
		return Math.abs(p.y - a.y) < CROSS_TOLERANCE;
	}

	const crossProduct = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
	return Math.abs(crossProduct) < CROSS_TOLERANCE;
}

export const Junctions: React.FC<JunctionsProps> = ({
	connections,
	blocks,
	showColors,
}) => {
	const dots = useMemo(() => {
		const pinLocations = new Set<string>();
		const junctions = new Map<string, boolean>();

		blocks.forEach((b) => {
			b.inputs.forEach((_, idx) => {
				const p = getInputPinPosition(b, idx);
				if (p) pinLocations.add(`${p.x},${p.y}`);
			});
			b.outputs.forEach((_, idx) => {
				const p = getOutputPinPosition(b, idx);
				if (p) pinLocations.add(`${p.x},${p.y}`);
			});
		});

		const netGroups = new Map<string, Connection[]>();

		connections.forEach((conn) => {
			const sourceKey = `${conn.from.blockId}:${
				conn.from.outputIndex ?? 0
			}`;
			if (!netGroups.has(sourceKey)) {
				netGroups.set(sourceKey, []);
			}
			netGroups.get(sourceKey)!.push(conn);
		});

		netGroups.forEach((groupConns, sourceKey) => {
			const [blockIdStr, outputIdxStr] = sourceKey.split(":");
			const sourceBlock = blocks.find((b) => b.id === Number(blockIdStr));
			const isHigh = sourceBlock?.outputs[Number(outputIdxStr)] === 1;

			const groupSegments: {
				p1: { x: number; y: number };
				p2: { x: number; y: number };
				connIndex: number;
			}[] = [];

			const groupPoints: { x: number; y: number; connIndex: number }[] =
				[];

			groupConns.forEach((conn, i) => {
				const fromBlock = blocks.find(
					(b) => b.id === conn.from.blockId
				);
				const toBlock = blocks.find((b) => b.id === conn.to.blockId);
				if (!fromBlock || !toBlock) return;

				const start = getOutputPinPosition(
					fromBlock,
					conn.from.outputIndex ?? 0
				);
				const end = getInputPinPosition(
					toBlock,
					conn.to.inputIndex
				) || {
					x: 0,
					y: 0,
				};

				const points = [start, ...(conn.points || []), end];

				points.forEach((p) => {
					groupPoints.push({ x: p.x, y: p.y, connIndex: i });
				});

				for (let j = 0; j < points.length - 1; j++) {
					groupSegments.push({
						p1: points[j],
						p2: points[j + 1],
						connIndex: i,
					});
				}
			});

			groupPoints.forEach((point) => {
				const key = `${point.x},${point.y}`;

				if (pinLocations.has(key)) return;
				if (junctions.has(key)) return;
				const hitsWireWithinNet = groupSegments.some((seg) => {
					if (seg.connIndex === point.connIndex) return false;
					return isPointOnSegment(point, seg.p1, seg.p2);
				});

				if (hitsWireWithinNet) {
					junctions.set(key, isHigh);
				} else {
					const isSharedNode = groupPoints.some(
						(otherP) =>
							otherP.connIndex !== point.connIndex &&
							otherP.x === point.x &&
							otherP.y === point.y
					);
					if (isSharedNode) {
						junctions.set(key, isHigh);
					}
				}
			});
		});

		return Array.from(junctions.entries()).map(([key, isHigh]) => {
			const [x, y] = key.split(",").map(Number);
			return { x, y, isHigh };
		});
	}, [connections, blocks]);

	return (
		<>
			{dots.map((dot, i) => {
				let fillColor = "#000";

				if (showColors) {
					fillColor = dot.isHigh ? "#green" : "#1976d2";
				}

				return (
					<circle
						key={`junction-${i}`}
						cx={dot.x}
						cy={dot.y}
						r={4}
						fill={fillColor}
						style={{
							pointerEvents: "none",
							transition: "fill 0.2s",
						}}
					/>
				);
			})}
		</>
	);
};
