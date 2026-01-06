import React, { useMemo } from "react";
import type { Connection, Block } from "../types";
import { getInputPinPosition, getOutputPinPosition } from "../pinPositions";

interface JunctionsProps {
	connections: Connection[];
	blocks: Block[];
	showColors: boolean;
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
		// Mapa kropkek: Klucz "x,y" -> isHigh (boolean)
		const junctions = new Map<string, boolean>();

		// 1. Zbieramy lokalizacje pinów (żeby nie stawiać kropki na samym pinie)
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

		// 2. Grupujemy połączenia według źródła sygnału
		// Klucz: "blockId:outputIndex", Wartość: Lista połączeń z tego źródła
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

		// 3. Analizujemy każdą sieć (grupę) osobno
		netGroups.forEach((groupConns, sourceKey) => {
			// Pobieramy stan logiczny dla całej tej sieci (wszystkie kropki w tej sieci będą miały ten sam kolor)
			const [blockIdStr, outputIdxStr] = sourceKey.split(":");
			const sourceBlock = blocks.find((b) => b.id === Number(blockIdStr));
			const isHigh = sourceBlock?.outputs[Number(outputIdxStr)] === 1;

			// Zbieramy wszystkie segmenty i punkty w obrębie tej jednej sieci
			const groupSegments: {
				p1: { x: number; y: number };
				p2: { x: number; y: number };
				connIndex: number; // lokalny index w grupie
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

			// Sprawdzamy przecięcia TYLKO wewnątrz tej grupy
			groupPoints.forEach((point) => {
				const key = `${point.x},${point.y}`;

				if (pinLocations.has(key)) return;
				if (junctions.has(key)) return; // Już dodana

				// Czy ten punkt leży na jakimś innym segmencie TEJ SAMEJ sieci?
				const hitsWireWithinNet = groupSegments.some((seg) => {
					// Ignorujemy segmenty należące do tego samego fizycznego połączenia (chyba że robi pętlę, ale to rzadkość)
					if (seg.connIndex === point.connIndex) return false;
					return isPointOnSegment(point, seg.p1, seg.p2);
				});

				if (hitsWireWithinNet) {
					junctions.set(key, isHigh);
				} else {
					// Sprawdzamy czy to punkt wspólny (węzeł) dwóch linii w tej samej sieci
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
				let fillColor = "#000"; // Domyślny czarny (tryb czarno-biały)

				if (showColors) {
					// Zielony dla High, szary/niebieski dla Low (zgodnie z konwencją w EditableWire)
					fillColor = dot.isHigh ? "#00AA00" : "#1976d2"; // Ujednoliciłem kolory
				}

				return (
					<circle
						key={`junction-${i}`}
						cx={dot.x}
						cy={dot.y}
						r={4} // Zmniejszyłem lekko kropkę dla estetyki (było 5)
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
