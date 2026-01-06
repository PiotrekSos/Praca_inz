import { evaluateCircuit } from "../logic/circuitSolver";
import type { Block, Connection } from "../types";
/* eslint-disable @typescript-eslint/no-explicit-any */
const generateStressCircuit = (gateCount: number) => {
	const blocks: Block[] = [];
	const connections: Connection[] = [];

	blocks.push({
		id: 0,
		type: "ONE",
		x: 0,
		y: 0,
		inputs: [],
		outputs: [1],
	});

	for (let i = 1; i <= gateCount; i++) {
		blocks.push({
			id: i,
			type: "NOT",
			x: i * 50,
			y: 0,
			inputs: [0],
			outputs: [0],
		});

		connections.push({
			from: { blockId: i - 1, pin: "output", outputIndex: 0 },
			to: { blockId: i, pin: "input", inputIndex: 0 },
		});
	}

	return { blocks, connections };
};

export const runPerformanceTests = () => {
	console.group(
		"%c TESTY WYDAJNOŚCIOWE (Stress Testing) ",
		"background: #c026d3; color: white; font-size: 16px; padding: 4px;"
	);
	console.log("Generowanie układów i pomiar czasu propagacji...");

	const scenarios = [5, 10, 50, 100, 200, 500, 1000];
	const results: any[] = [];

	scenarios.forEach((count) => {
		const { blocks, connections } = generateStressCircuit(count);
		const iterations = 10;
		const start = performance.now();

		for (let i = 0; i < iterations; i++) {
			blocks[0].outputs[0] = i % 2;
			evaluateCircuit(blocks, connections);
		}

		const end = performance.now();
		const totalTime = end - start;
		const avgTimePerTick = totalTime / iterations;

		const status =
			avgTimePerTick < 16 ? "✅ PŁYNNIE (60FPS)" : "⚠️ SPADEK FPS";

		results.push({
			"Liczba Elementów": count,
			"Liczba Połączeń": count,
			"Średni Czas (ms)": avgTimePerTick.toFixed(4),
			Status: status,
		});
	});

	console.table(results);
	console.groupEnd();
};
