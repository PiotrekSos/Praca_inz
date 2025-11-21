import React, { useMemo } from "react";
import type { Connection, Block } from "../types";
import { getInputPinPosition, getOutputPinPosition } from "../pinPositions";

interface JunctionsProps {
	connections: Connection[];
	blocks: Block[];
	showColors: boolean; // <--- NOWY PROP
}

// Funkcja pomocnicza: sprawdza czy punkt p leży na odcinku a-b
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
		// Zmieniamy Set na Map, żeby przechowywać też stan logiczny (isHigh)
		// Klucz: "x,y", Wartość: boolean (true = high, false = low)
		const junctions = new Map<string, boolean>();

		// 1. Zbieramy lokalizacje pinów
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

		// 2. Dane do obliczeń
		const allSegments: {
			p1: { x: number; y: number };
			p2: { x: number; y: number };
			connIndex: number;
		}[] = [];

		const allPoints: { x: number; y: number; connIndex: number }[] = [];

		connections.forEach((conn, i) => {
			const fromBlock = blocks.find((b) => b.id === conn.from.blockId);
			const toBlock = blocks.find((b) => b.id === conn.to.blockId);
			if (!fromBlock || !toBlock) return;

			const start = getOutputPinPosition(
				fromBlock,
				conn.from.outputIndex ?? 0
			);
			const end = getInputPinPosition(toBlock, conn.to.inputIndex) || {
				x: 0,
				y: 0,
			};

			const points = [start, ...(conn.points || []), end];

			points.forEach((p) => {
				allPoints.push({ x: p.x, y: p.y, connIndex: i });
			});

			for (let j = 0; j < points.length - 1; j++) {
				allSegments.push({
					p1: points[j],
					p2: points[j + 1],
					connIndex: i,
				});
			}
		});

		// Pomocnicza funkcja do sprawdzania stanu logicznego kabla
		const getWireState = (connIndex: number) => {
			const conn = connections[connIndex];
			if (!conn) return false;
			const block = blocks.find((b) => b.id === conn.from.blockId);
			// Pobieramy stan wyjścia, z którego wychodzi kabel
			return block?.outputs[conn.from.outputIndex ?? 0] === 1;
		};

		// 3. Sprawdzamy przecięcia
		allPoints.forEach((point) => {
			const key = `${point.x},${point.y}`;

			if (pinLocations.has(key)) return;
			if (junctions.has(key)) return;

			const hitsOtherWire = allSegments.some((seg) => {
				if (seg.connIndex === point.connIndex) return false;
				return isPointOnSegment(point, seg.p1, seg.p2);
			});

			if (hitsOtherWire) {
				// Jeśli wykryliśmy łączenie, pobieramy stan logiczny tego punktu
				junctions.set(key, getWireState(point.connIndex));
			} else {
				const isSharedPoint = allPoints.some(
					(otherP) =>
						otherP.connIndex !== point.connIndex &&
						otherP.x === point.x &&
						otherP.y === point.y
				);
				if (isSharedPoint) {
					junctions.set(key, getWireState(point.connIndex));
				}
			}
		});

		// Konwersja Mapy na tablicę obiektów
		return Array.from(junctions.entries()).map(([key, isHigh]) => {
			const [x, y] = key.split(",").map(Number);
			return { x, y, isHigh };
		});
	}, [connections, blocks]);

	return (
		<>
			{dots.map((dot, i) => {
				// Logika kolorów
				let fillColor = "#000"; // Domyślny czarny

				if (showColors) {
					// Jeśli włączone kolory: Zielony dla High, Czarny/Szary dla Low
					// (Możesz zmienić 'green' na dowolny kolor np. '#00AA00')
					fillColor = dot.isHigh ? "green" : "#1976d2";
				}

				return (
					<circle
						key={`junction-${i}`}
						cx={dot.x}
						cy={dot.y}
						r={5}
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
