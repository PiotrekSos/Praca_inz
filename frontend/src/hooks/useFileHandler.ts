import { useCallback } from "react";
import type { Block, Connection, SaveData, JsonBlock } from "../types";
import { evaluateCircuit } from "../logic/circuitSolver";

interface UseFileHandlerProps {
	blocks: Block[];
	connections: Connection[];
	viewport: { x: number; y: number; scale: number };
	setBlocks: (blocks: Block[]) => void;
	setConnections: (connections: Connection[]) => void;
	setViewport: (viewport: { x: number; y: number; scale: number }) => void;
	setCircuitVersion: React.Dispatch<React.SetStateAction<number>>;
	setSelection: (val: null) => void;
	setPending: (val: { from: null }) => void;
}

export const useFileHandler = ({
	blocks,
	connections,
	viewport,
	setBlocks,
	setConnections,
	setViewport,
	setCircuitVersion,
	setSelection,
	setPending,
}: UseFileHandlerProps) => {
	const handleSave = useCallback(() => {
		const blocksForSave: JsonBlock[] = blocks.map((b) => {
			if (b.type === "RAM_16x4" && b.memory) {
				// Konwertujemy Uint8Array na zwykły obiekt { "0": val, "1": val... }
				const memoryRecord: Record<string, number> = {};
				b.memory.forEach((val, index) => {
					memoryRecord[index] = val;
				});

				// Zwracamy blok z podmienioną pamięcią
				return { ...b, memory: memoryRecord };
			}

			// NAPRAWA BŁĘDU LINTERA:
			// Zmieniamy 'memory' na '_memory'. TypeScript/ESLint zazwyczaj ignoruje
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { memory: _memory, ...rest } = b;
			return rest as JsonBlock;
		});

		const data: SaveData = {
			version: "1.0",
			blocks: blocksForSave,
			connections: connections,
			viewport: viewport,
		};

		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "uklad_logiczny.json";
		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, [blocks, connections, viewport]);

	const handleLoad = useCallback(
		(data: SaveData) => {
			if (!data || typeof data !== "object") {
				alert("Nieprawidłowy format pliku!");
				return;
			}

			if (
				!Array.isArray(data.blocks) ||
				!Array.isArray(data.connections)
			) {
				alert(
					"Plik nie zawiera wymaganych danych (blocks/connections)."
				);
				return;
			}

			const restoredBlocks = data.blocks.map((b) => {
				// Logika przywracania RAMu
				if (b.type === "RAM_16x4" && b.memory) {
					const mem = new Uint8Array(16);
					for (let i = 0; i < 16; i++) {
						// rzutowanie klucza obiektu na string
						mem[i] = b.memory[String(i)] || 0;
					}
					return { ...b, memory: mem } as Block;
				}
				return b as Block;
			});

			const evaluatedBlocks = evaluateCircuit(
				restoredBlocks,
				data.connections
			);

			setBlocks(evaluatedBlocks);
			setConnections(data.connections);

			if (data.viewport) {
				setViewport(data.viewport);
			}

			setCircuitVersion((v) => v + 1);
			setSelection(null);
			setPending({ from: null });
		},
		[
			setBlocks,
			setConnections,
			setViewport,
			setCircuitVersion,
			setSelection,
			setPending,
		]
	);

	return { handleSave, handleLoad };
};
