import { evaluateCircuit } from "../logic/circuitSolver";
import type { Block, Connection } from "../types";
/* eslint-disable @typescript-eslint/no-explicit-any */
const createBlock = (
	id: number,
	type: any,
	inputsCount: number = 0
): Block => ({
	id,
	type,
	x: 0,
	y: 0,
	inputs: new Array(inputsCount).fill(0),
	outputs: [0],
});

let totalTests = 0;
let passedTests = 0;

const assert = (
	group: string,
	caseName: string,
	actual: any,
	expected: any
) => {
	totalTests++;
	const isMatch = Array.isArray(expected)
		? JSON.stringify(actual) === JSON.stringify(expected)
		: actual === expected;

	if (isMatch) {
		passedTests++;
	} else {
		console.error(
			`%c[FAIL] ${group} -> ${caseName}`,
			"color: #f87171; font-weight:bold"
		);
		console.log(`   Oczekiwano: ${expected}, Otrzymano: ${actual}`);
	}
};

const runCombinationalTest = (
	type: string,
	inputs: number[],
	expectedOutputs: number[],
	inputLabel: string
) => {
	const dutId = 100;
	const dut = createBlock(dutId, type, inputs.length);

	const blocks: Block[] = [dut];
	const connections: Connection[] = [];

	inputs.forEach((val, idx) => {
		const srcId = idx + 1;
		const src = createBlock(srcId, val === 1 ? "ONE" : "ZERO");
		src.outputs[0] = val;
		blocks.push(src);
		connections.push({
			from: { blockId: srcId, pin: "output", outputIndex: 0 },
			to: { blockId: dutId, pin: "input", inputIndex: idx },
		});
	});

	const res = evaluateCircuit(blocks, connections);
	const dutRes = res.find((b) => b.id === dutId);

	const actual = dutRes?.outputs.slice(0, expectedOutputs.length);
	assert(type, `Wejścia: [${inputLabel}]`, actual, expectedOutputs);
};

const runSequentialTest = (
	type: string,
	steps: { inputs: number[]; expect: number[]; desc: string }[]
) => {
	const dutId = 200;
	const outputCount = type.includes("RAM") ? 4 : 2;
	const dut = createBlock(dutId, type, steps[0].inputs.length);

	dut.outputs = new Array(outputCount).fill(0);

	dut.state = 0;
	dut.prevClock = 0;
	if (type.includes("RAM")) {
		dut.memory = new Uint8Array(16);
	}

	let currentDutState = { ...dut };

	steps.forEach((step, i) => {
		const currentSources: Block[] = [];
		const currentConns: Connection[] = [];

		step.inputs.forEach((val, idx) => {
			const srcId = 1000 + idx;
			const src = createBlock(srcId, val === 1 ? "ONE" : "ZERO");
			src.outputs[0] = val;
			currentSources.push(src);
			currentConns.push({
				from: { blockId: srcId, pin: "output", outputIndex: 0 },
				to: { blockId: dutId, pin: "input", inputIndex: idx },
			});
		});

		const blocksToSimulate = [currentDutState, ...currentSources];

		const res = evaluateCircuit(blocksToSimulate, currentConns);

		const resDut = res.find((b) => b.id === dutId);
		if (resDut) {
			currentDutState = { ...resDut };
		}

		const actual = currentDutState.outputs.slice(0, step.expect.length);
		assert(
			`${type} (Seq)`,
			`Krok ${i + 1}: ${step.desc}`,
			actual,
			step.expect
		);
	});
};

export const runComprehensiveTests = () => {
	console.clear();
	totalTests = 0;
	passedTests = 0;
	console.group(
		"%c PEŁNA WALIDACJA SYSTEMU (System Verification) ",
		"background: #111827; color: #60a5fa; font-size: 16px; padding: 8px; border-radius: 4px;"
	);

	console.groupCollapsed("1. Bramki Podstawowe");

	runCombinationalTest("AND", [0, 0], [0], "0,0");
	runCombinationalTest("AND", [0, 1], [0], "0,1");
	runCombinationalTest("AND", [1, 0], [0], "1,0");
	runCombinationalTest("AND", [1, 1], [1], "1,1");

	runCombinationalTest("OR", [0, 0], [0], "0,0");
	runCombinationalTest("OR", [0, 1], [1], "0,1");
	runCombinationalTest("OR", [1, 0], [1], "1,0");
	runCombinationalTest("OR", [1, 1], [1], "1,1");

	runCombinationalTest("XOR", [0, 0], [0], "0,0");
	runCombinationalTest("XOR", [0, 1], [1], "0,1");
	runCombinationalTest("XOR", [1, 0], [1], "1,0");
	runCombinationalTest("XOR", [1, 1], [0], "1,1");

	runCombinationalTest("NAND", [0, 0], [1], "0,0");
	runCombinationalTest("NAND", [1, 1], [0], "1,1");

	runCombinationalTest("NOR", [0, 0], [1], "0,0");
	runCombinationalTest("NOR", [0, 1], [0], "0,1");

	runCombinationalTest("NOT", [0], [1], "0");
	runCombinationalTest("NOT", [1], [0], "1");
	runCombinationalTest("BUFFER", [0], [0], "0");
	runCombinationalTest("BUFFER", [1], [1], "1");

	console.groupEnd();

	console.groupCollapsed("2. Bramki Wielowejściowe");

	runCombinationalTest("NAND_4", [1, 1, 1, 1], [0], "1,1,1,1");
	runCombinationalTest("NAND_4", [1, 1, 0, 1], [1], "1,1,0,1");

	runCombinationalTest("NOR_4", [0, 0, 0, 0], [1], "0,0,0,0");
	runCombinationalTest("NOR_4", [1, 0, 0, 0], [0], "1,0,0,0");

	console.groupEnd();

	console.groupCollapsed("3. Układy Kombinacyjne Złożone (MUX/DEMUX)");

	runCombinationalTest(
		"MUX4",
		[1, 0, 0, 0, 0, 0, 0],
		[0],
		"Sel=0, D0=1, E=0 -> Out=!1"
	);
	runCombinationalTest(
		"MUX4",
		[0, 0, 0, 0, 0, 0, 0],
		[1],
		"Sel=0, D0=0, E=0 -> Out=!0"
	);
	runCombinationalTest(
		"MUX4",
		[0, 1, 0, 0, 0, 1, 0],
		[0],
		"Sel=1, D1=1, E=0 -> Out=!1"
	);
	runCombinationalTest(
		"MUX4",
		[1, 1, 1, 1, 0, 0, 1],
		[1],
		"E=1 (Disabled) -> Out=1"
	);

	runCombinationalTest(
		"DEMUX4",
		[1, 0, 0, 0],
		[0, 1, 1, 1],
		"In=1, Sel=0 -> Out0 Active(0)"
	);
	runCombinationalTest(
		"DEMUX4",
		[1, 1, 1, 0],
		[1, 1, 1, 0],
		"In=1, Sel=3 -> Out3 Active(0)"
	);

	console.groupEnd();
	console.groupCollapsed("4. Układy Sekwencyjne");

	runSequentialTest("SR_FLIPFLOP", [
		{
			inputs: [1, 0, 0],
			expect: [0, 1],
			desc: "S=1, R=0, Clk=0 (Brak zbocza -> Brak zmian)",
		},
		{
			inputs: [1, 0, 1],
			expect: [1, 0],
			desc: "S=1, R=0, Clk=1 (Zbocze -> SET Q=1)",
		},
		{
			inputs: [0, 0, 0],
			expect: [1, 0],
			desc: "S=0, R=0, Clk=0 (Pamięć Q=1)",
		},
		{
			inputs: [0, 1, 1],
			expect: [0, 1],
			desc: "S=0, R=1, Clk=1 (Zbocze -> RESET Q=0)",
		},
		{
			inputs: [0, 0, 0],
			expect: [0, 1],
			desc: "S=0, R=0, Clk=0 (Pamięć Q=0)",
		},
	]);

	runSequentialTest("JK_FLIPFLOP", [
		{
			inputs: [0, 0, 0, 1, 1],
			expect: [0, 1],
			desc: "Init (S=1, R=1, Clk=0)",
		},
		{
			inputs: [1, 0, 0, 1, 1],
			expect: [0, 1],
			desc: "J=1, K=0, Clk=0 (Czekam na zbocze)",
		},
		{
			inputs: [1, 0, 1, 1, 1],
			expect: [1, 0],
			desc: "J=1, K=0, Clk=1 (Zbocze -> SET)",
		},
		{
			inputs: [1, 0, 0, 1, 1],
			expect: [1, 0],
			desc: "J=1, K=0, Clk=0 (Opadanie -> Pamięć)",
		},
		{
			inputs: [0, 1, 1, 1, 1],
			expect: [0, 1],
			desc: "J=0, K=1, Clk=1 (Zbocze -> RESET)",
		},
		{ inputs: [1, 1, 0, 1, 1], expect: [0, 1], desc: "J=1, K=1, Clk=0" },
		{
			inputs: [1, 1, 1, 1, 1],
			expect: [1, 0],
			desc: "J=1, K=1, Clk=1 (Toggle 0->1)",
		},
	]);

	runSequentialTest("D_FLIPFLOP", [
		{
			inputs: [0, 0, 0, 1],
			expect: [1, 0],
			desc: "Async SET (S=0) -> Q=1",
		},
		{
			inputs: [0, 0, 1, 1],
			expect: [1, 0],
			desc: "S=1 (Idle) -> Pamięć Q=1",
		},
		{
			inputs: [0, 1, 1, 1],
			expect: [0, 1],
			desc: "D=0, Clk=1 (Zbocze) -> Q=0",
		},
		{
			inputs: [1, 0, 1, 1],
			expect: [0, 1],
			desc: "D=1, Clk=0 -> Pamięć Q=0",
		},
		{
			inputs: [1, 1, 1, 1],
			expect: [1, 0],
			desc: "D=1, Clk=1 (Zbocze) -> Q=1",
		},
	]);

	console.groupEnd();
	console.groupCollapsed("5. Pamięć RAM 16x4");

	const ramSteps = [
		{
			inputs: [1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
			expect: [1, 1, 1, 1],
			desc: "Zapis 9 pod Adres 2",
		},
		{
			inputs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			expect: [1, 1, 1, 1],
			desc: "Odczyt Adres 0 (Pusty)",
		},
		{
			inputs: [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
			expect: [0, 1, 1, 0],
			desc: "Odczyt Adres 2 (Oczekiwane 9 zanegowane)",
		},
		{
			inputs: [0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
			expect: [1, 1, 1, 1],
			desc: "CS=1 (Disabled) -> Wyjścia 1",
		},
	];
	runSequentialTest("RAM_16x4", ramSteps);

	console.groupEnd();

	const color = passedTests === totalTests ? "#4ade80" : "#f87171";
	console.log(
		`%c WYNIK TESTÓW: ${passedTests} / ${totalTests} ZALICZONYCH `,
		`background: ${color}; color: black; font-size: 18px; font-weight: bold; padding: 10px; border-radius: 8px; margin-top: 20px;`
	);

	console.groupEnd();
};
