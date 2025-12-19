import { useState, useEffect, useCallback } from "react";
import type { Block, Connection } from "../types";
import { evaluateCircuit } from "../logic/circuitSolver";

interface UseSimulationProps {
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	connections: Connection[];
}

export const useSimulation = ({
	blocks,
	setBlocks,
	connections,
}: UseSimulationProps) => {
	const [isSimulationRunning, setIsSimulationRunning] = useState(false);

	const handleReset = useCallback(() => {
		setIsSimulationRunning(false);
		const resetBlocks = blocks.map((block) => {
			const newBlock = { ...block };
			newBlock.inputs = newBlock.inputs.map(() => 0);
			if ("state" in newBlock) newBlock.state = 0;
			if ("prevClock" in newBlock) newBlock.prevClock = 0;
			if ("memory" in newBlock) newBlock.memory = new Uint8Array(16);
			newBlock.outputs = newBlock.outputs.map(() => 0);
			return newBlock;
		});
		const initializedBlocks = evaluateCircuit(resetBlocks, connections);
		setBlocks(initializedBlocks);
	}, [blocks, connections, setBlocks]);

	const handleToggleSimulation = useCallback(() => {
		if (isSimulationRunning) {
			setIsSimulationRunning(false);
		} else {
			// Walidacja
			for (const block of blocks) {
				if (
					[
						"ONE",
						"ZERO",
						"TOGGLE",
						"CLOCK",
						"LABEL",
						"RAM_16x4",
					].includes(block.type)
				)
					continue;
				for (let i = 0; i < block.inputs.length; i++) {
					const isConnected = connections.some(
						(c) =>
							c.to.blockId === block.id && c.to.inputIndex === i
					);
					if (!isConnected) {
						alert(
							`Błąd: Blok (ID: ${block.id}, Typ: ${block.type}) ma niepodłączone wejście nr ${i}.`
						);
						return;
					}
				}
			}
			setIsSimulationRunning(true);
		}
	}, [isSimulationRunning, blocks, connections]);

	// Interval
	useEffect(() => {
		if (!isSimulationRunning) return;
		const interval = setInterval(() => {
			setBlocks((prev) => {
				const updated = prev.map((b) =>
					b.type === "CLOCK"
						? { ...b, outputs: [b.outputs[0] === 1 ? 0 : 1, 0] }
						: b
				);
				return evaluateCircuit(updated, connections);
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [isSimulationRunning, connections, setBlocks]);

	return {
		isSimulationRunning,
		setIsSimulationRunning,
		handleReset,
		handleToggleSimulation,
	};
};
