import { useEffect, useCallback } from "react";
import type { Block, Connection, BlockType, Selection } from "../types";
import { evaluateCircuit } from "../logic/circuitSolver";
import { getBlockConfig } from "../utils/blockConfig";

interface UseCircuitActionsProps {
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	connections: Connection[];
	setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
	selection: Selection;
	setSelection: (val: Selection) => void;
	pending: { from: { blockId: number; outputIndex?: number } | null };
	setPending: (val: {
		from: { blockId: number; outputIndex?: number } | null;
	}) => void;
	viewport: { x: number; y: number; scale: number };
}

export const useCircuitActions = ({
	blocks,
	setBlocks,
	connections,
	setConnections,
	selection,
	setSelection,
	pending,
	setPending,
	viewport,
}: UseCircuitActionsProps) => {
	const handleAddBlock = useCallback(
		(type: BlockType) => {
			const { inputCount, outputCount } = getBlockConfig(type);

			const newBlock: Block = {
				id: Math.max(0, ...blocks.map((b) => b.id)) + 1,
				type,
				x:
					(200 - viewport.x) / viewport.scale +
					(blocks.length % 10) * 40,
				y:
					(100 - viewport.y) / viewport.scale +
					(blocks.length % 10) * 40,
				inputs: new Array(inputCount).fill(0),
				outputs: new Array(outputCount).fill(0),
				...(type === "RAM_16x4" && { memory: new Uint8Array(16) }),
				...(type === "LABEL" && { label: "Tekst" }),
			};
			setBlocks((prev) =>
				evaluateCircuit([...prev, newBlock], connections)
			);
		},
		[blocks, connections, viewport, setBlocks]
	);

	const handleMove = useCallback(
		(id: number, x: number, y: number, newOutput?: number) => {
			setBlocks((prev) => {
				let updated = prev.map((b) => {
					if (
						b.id === id &&
						b.type === "TOGGLE" &&
						newOutput !== undefined
					)
						return { ...b, outputs: [newOutput] };
					if (b.id === id) return { ...b, x, y };
					return b;
				});
				if (prev.find((b) => b.id === id && b.type === "TOGGLE")) {
					updated = evaluateCircuit(updated, connections);
				}
				return updated;
			});
		},
		[connections, setBlocks]
	);

	const handleLabelChange = useCallback(
		(id: number, newLabel: string) => {
			setBlocks((prev) =>
				prev.map((b) => (b.id === id ? { ...b, label: newLabel } : b))
			);
		},
		[setBlocks]
	);

	const handlePinClick = useCallback(
		(blockId: number, pin: "input" | "output", index?: number) => {
			if (pin === "output" && !pending.from) {
				setPending({ from: { blockId, outputIndex: index ?? 0 } });
			} else if (pin === "input" && pending.from) {
				if (pending.from.blockId === blockId) {
					setPending({ from: null });
					return;
				}
				const isInputOccupied = connections.some(
					(c) =>
						c.to.blockId === blockId &&
						c.to.inputIndex === (index ?? 0)
				);
				if (isInputOccupied) {
					alert("To wejście jest już podłączone!");
					setPending({ from: null });
					return;
				}
				const newConnections = [
					...connections,
					{
						from: {
							blockId: pending.from.blockId,
							pin: "output" as const,
							outputIndex: pending.from.outputIndex ?? 0,
						},
						to: {
							blockId,
							pin: "input" as const,
							inputIndex: index ?? 0,
						},
					},
				];
				setConnections(newConnections);
				setBlocks((prev) => evaluateCircuit(prev, newConnections));
				setPending({ from: null });
			}
		},
		[connections, pending, setBlocks, setConnections, setPending]
	);

	// Obsługa klawisza Delete
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.key === "Delete" || e.key === "Backspace") && selection) {
				if (selection.type === "block") {
					const blockId = selection.id;
					setBlocks((prevBlocks) => {
						const newBlocks = prevBlocks.filter(
							(b) => b.id !== blockId
						);
						// Musimy filtrować połączenia wewnątrz settera lub pobrać je z zewnątrz
						// Dla uproszczenia zakładamy, że connections jest aktualne z propsów
						const newConnections = connections.filter(
							(c) =>
								c.from.blockId !== blockId &&
								c.to.blockId !== blockId
						);
						setConnections(newConnections);
						return evaluateCircuit(newBlocks, newConnections);
					});
					setSelection(null);
				} else if (selection.type === "connection") {
					const connIndex = selection.index;
					const newConnections = connections.filter(
						(_, index) => index !== connIndex
					);
					setConnections(newConnections);
					setBlocks((prev) => evaluateCircuit(prev, newConnections));
					setSelection(null);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		selection,
		blocks,
		connections,
		setBlocks,
		setConnections,
		setSelection,
	]);

	return { handleAddBlock, handleMove, handleLabelChange, handlePinClick };
};
