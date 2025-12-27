import { evaluateCircuit } from "../logic/circuitSolver";
import type { Block, Connection } from "../types";

// ==========================================
// NARZĘDZIA TESTOWE (TEST HARNESS)
// ==========================================

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
	outputs: [0], // Domyślne wyjście, solver je nadpisze
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
	// Porównanie proste lub tablicowe
	const isMatch = Array.isArray(expected)
		? JSON.stringify(actual) === JSON.stringify(expected)
		: actual === expected;

	if (isMatch) {
		passedTests++;
		// Opcjonalnie: odkomentuj, żeby widzieć każdy pojedynczy sukces (dużo spamu)
		// console.log(`%c[OK] ${group} -> ${caseName}`, "color: #86efac");
	} else {
		console.error(
			`%c[FAIL] ${group} -> ${caseName}`,
			"color: #f87171; font-weight:bold"
		);
		console.log(`   Oczekiwano: ${expected}, Otrzymano: ${actual}`);
	}
};

/**
 * Testuje układ kombinacyjny (bez pamięci).
 * Tworzy bramkę, podpina wirtualne źródła, puszcza symulację raz i sprawdza wynik.
 */
const runCombinationalTest = (
	type: string,
	inputs: number[],
	expectedOutputs: number[], // Tablica oczekiwanych wyjść (np. [0] albo [1,0])
	inputLabel: string
) => {
	const dutId = 100; // Device Under Test
	const dut = createBlock(dutId, type, inputs.length);

	const blocks: Block[] = [dut];
	const connections: Connection[] = [];

	// Tworzenie źródeł
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

	// Sprawdź tyle wyjść, ile zdefiniowano w expectedOutputs
	const actual = dutRes?.outputs.slice(0, expectedOutputs.length);
	assert(type, `Wejścia: [${inputLabel}]`, actual, expectedOutputs);
};

/**
 * Testuje układ sekwencyjny (z pamięcią).
 * Utrzymuje ten sam blok przez wiele kroków.
 */
const runSequentialTest = (
	type: string,
	steps: { inputs: number[]; expect: number[]; desc: string }[]
) => {
	const dutId = 200;
	// Ustalamy liczbę wejść na podstawie pierwszego kroku
	// DLA RAMU: Musimy upewnić się, że wyjść jest 4. Dla innych domyślnie 1 lub 2.
	const outputCount = type.includes("RAM") ? 4 : 2;
	const dut = createBlock(dutId, type, steps[0].inputs.length);

	// Wymuszamy odpowiednią liczbę wyjść
	dut.outputs = new Array(outputCount).fill(0);

	// Inicjalizacja stanu wewnętrznego
	dut.state = 0;
	dut.prevClock = 0;
	if (type.includes("RAM")) {
		dut.memory = new Uint8Array(16); // Inicjalizacja pamięci dla RAM
	}

	// Obiekt przechowujący aktualny stan DUT
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

		// WAŻNE: Używamy obiektu z zachowanym stanem z poprzedniego kroku
		const blocksToSimulate = [currentDutState, ...currentSources];

		const res = evaluateCircuit(blocksToSimulate, currentConns);

		// Zapisujemy nowy stan DUT do użycia w następnym kroku
		const resDut = res.find((b) => b.id === dutId);
		if (resDut) {
			currentDutState = { ...resDut }; // Kopiujemy cały obiekt z nowym memory/state/prevClock
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

// ==========================================
// DEFINICJE TESTÓW
// ==========================================

export const runComprehensiveTests = () => {
	console.clear();
	totalTests = 0;
	passedTests = 0;
	console.group(
		"%c PEŁNA WALIDACJA SYSTEMU (System Verification) ",
		"background: #111827; color: #60a5fa; font-size: 16px; padding: 8px; border-radius: 4px;"
	);

	// --- 1. BRAMKI PODSTAWOWE (Truth Tables) ---
	console.groupCollapsed("1. Bramki Podstawowe");

	// AND
	runCombinationalTest("AND", [0, 0], [0], "0,0");
	runCombinationalTest("AND", [0, 1], [0], "0,1");
	runCombinationalTest("AND", [1, 0], [0], "1,0");
	runCombinationalTest("AND", [1, 1], [1], "1,1");

	// OR
	runCombinationalTest("OR", [0, 0], [0], "0,0");
	runCombinationalTest("OR", [0, 1], [1], "0,1");
	runCombinationalTest("OR", [1, 0], [1], "1,0");
	runCombinationalTest("OR", [1, 1], [1], "1,1");

	// XOR
	runCombinationalTest("XOR", [0, 0], [0], "0,0");
	runCombinationalTest("XOR", [0, 1], [1], "0,1");
	runCombinationalTest("XOR", [1, 0], [1], "1,0");
	runCombinationalTest("XOR", [1, 1], [0], "1,1");

	// NAND
	runCombinationalTest("NAND", [0, 0], [1], "0,0");
	runCombinationalTest("NAND", [1, 1], [0], "1,1");

	// NOR
	runCombinationalTest("NOR", [0, 0], [1], "0,0");
	runCombinationalTest("NOR", [0, 1], [0], "0,1");

	// NOT & BUFFER
	runCombinationalTest("NOT", [0], [1], "0");
	runCombinationalTest("NOT", [1], [0], "1");
	runCombinationalTest("BUFFER", [0], [0], "0");
	runCombinationalTest("BUFFER", [1], [1], "1");

	console.groupEnd();

	// --- 2. BRAMKI WIELOWEJŚCIOWE ---
	console.groupCollapsed("2. Bramki Wielowejściowe");

	// NAND_4 (Wszystkie 1 -> 0, inaczej 1)
	runCombinationalTest("NAND_4", [1, 1, 1, 1], [0], "1,1,1,1");
	runCombinationalTest("NAND_4", [1, 1, 0, 1], [1], "1,1,0,1");

	// NOR_4 (Wszystkie 0 -> 1, inaczej 0)
	runCombinationalTest("NOR_4", [0, 0, 0, 0], [1], "0,0,0,0");
	runCombinationalTest("NOR_4", [1, 0, 0, 0], [0], "1,0,0,0");

	console.groupEnd();

	// --- 3. MULTIPLEKSERY I DEMULTIPLEKSERY ---
	console.groupCollapsed("3. Układy Kombinacyjne Złożone (MUX/DEMUX)");

	// MUX4 (Negowane wyjście!)
	// Pinout: [D0, D1, D2, D3, S0, S1, E_low]
	// Sel 00 (D0=1) -> Wyjście 0 (bo negacja)
	runCombinationalTest(
		"MUX4",
		[1, 0, 0, 0, 0, 0, 0],
		[0],
		"Sel=0, D0=1, E=0 -> Out=!1"
	);
	// Sel 00 (D0=0) -> Wyjście 1 (bo negacja)
	runCombinationalTest(
		"MUX4",
		[0, 0, 0, 0, 0, 0, 0],
		[1],
		"Sel=0, D0=0, E=0 -> Out=!0"
	);
	// Sel 01 (D1=1) -> Wyjście 0
	runCombinationalTest(
		"MUX4",
		[0, 1, 0, 0, 0, 1, 0],
		[0],
		"Sel=1, D1=1, E=0 -> Out=!1"
	);
	// Disabled (E=1) -> Zawsze 1
	runCombinationalTest(
		"MUX4",
		[1, 1, 1, 1, 0, 0, 1],
		[1],
		"E=1 (Disabled) -> Out=1"
	);

	// DEMUX4 (Negowane wyjścia!)
	// Pinout: [IN, S0, S1, E_low]
	// In=1, Sel=00 -> Out0=0 (aktywny niski), reszta 1
	runCombinationalTest(
		"DEMUX4",
		[1, 0, 0, 0],
		[0, 1, 1, 1],
		"In=1, Sel=0 -> Out0 Active(0)"
	);
	// In=1, Sel=11 (3) -> Out3=0
	runCombinationalTest(
		"DEMUX4",
		[1, 1, 1, 0],
		[1, 1, 1, 0],
		"In=1, Sel=3 -> Out3 Active(0)"
	);

	console.groupEnd();

	// --- 4. UKŁADY SEKWENCYJNE (PRZERZUTNIKI) ---
	console.groupCollapsed("4. Układy Sekwencyjne");

	// SR FLIPFLOP [S, R] -> Q, !Q
	runSequentialTest("SR_FLIPFLOP", [
		// Krok 1: Ustawiamy S=1, ale Zegar=0. Stan nie powinien się zmienić (domyślnie 0).
		{
			inputs: [1, 0, 0],
			expect: [0, 1],
			desc: "S=1, R=0, Clk=0 (Brak zbocza -> Brak zmian)",
		},
		// Krok 2: Zegar idzie w górę (0->1). To jest zbocze! Następuje SET.
		{
			inputs: [1, 0, 1],
			expect: [1, 0],
			desc: "S=1, R=0, Clk=1 (Zbocze -> SET Q=1)",
		},
		// Krok 3: Zegar opada, S i R zerujemy. Pamięć powinna trzymać 1.
		{
			inputs: [0, 0, 0],
			expect: [1, 0],
			desc: "S=0, R=0, Clk=0 (Pamięć Q=1)",
		},
		// Krok 4: Ustawiamy R=1, Zegar idzie w górę. Następuje RESET.
		{
			inputs: [0, 1, 1],
			expect: [0, 1],
			desc: "S=0, R=1, Clk=1 (Zbocze -> RESET Q=0)",
		},
		// Krok 5: Zegar opada. Pamięć powinna trzymać 0.
		{
			inputs: [0, 0, 0],
			expect: [0, 1],
			desc: "S=0, R=0, Clk=0 (Pamięć Q=0)",
		},
	]);

	// JK FLIPFLOP [J, K, CLK, S_low, R_low]
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
		// Toggle
		{ inputs: [1, 1, 0, 1, 1], expect: [0, 1], desc: "J=1, K=1, Clk=0" },
		{
			inputs: [1, 1, 1, 1, 1],
			expect: [1, 0],
			desc: "J=1, K=1, Clk=1 (Toggle 0->1)",
		},
	]);

	// D FLIPFLOP [D, CLK, S_low, R_low]
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

	// --- 5. PAMIĘĆ RAM ---
	console.groupCollapsed("5. Pamięć RAM 16x4");

	const ramSteps = [
		// 1. Zapis 9 (1001) pod adres 2 (0010)
		{
			// D=1001, A=0100, CS=0, WE=0 (Zapis)
			// inputs: [D0, D1, D2, D3, A0, A1, A2, A3, CS, WE]
			// D0=1, D1=0, D2=0, D3=1 | A0=0, A1=1, A2=0, A3=0
			inputs: [1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
			expect: [1, 1, 1, 1], // Podczas zapisu wyjścia są nieaktywne (1)
			desc: "Zapis 9 pod Adres 2",
		},
		// 2. Zmiana adresu na 0, Tryb Odczyt
		{
			// D=xxxx, A=0000, CS=0, WE=1 (Odczyt)
			inputs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			expect: [1, 1, 1, 1], // Pamięć pusta (0), wyjścia zanegowane -> 1111
			desc: "Odczyt Adres 0 (Pusty)",
		},
		// 3. Powrót do adresu 2, Tryb Odczyt
		{
			// A=0100, CS=0, WE=1
			inputs: [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
			// Oczekujemy odczytu 9 (1001). Wyjścia zanegowane: !(1001) -> 0110
			// Zatem Q0=0, Q1=1, Q2=1, Q3=0
			expect: [0, 1, 1, 0],
			desc: "Odczyt Adres 2 (Oczekiwane 9 zanegowane)",
		},
		// 4. Chip Select Disable (CS=1)
		{
			inputs: [0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
			expect: [1, 1, 1, 1],
			desc: "CS=1 (Disabled) -> Wyjścia 1",
		},
	];
	runSequentialTest("RAM_16x4", ramSteps);

	console.groupEnd();

	// --- PODSUMOWANIE ---
	const color = passedTests === totalTests ? "#4ade80" : "#f87171";
	console.log(
		`%c WYNIK TESTÓW: ${passedTests} / ${totalTests} ZALICZONYCH `,
		`background: ${color}; color: black; font-size: 18px; font-weight: bold; padding: 10px; border-radius: 8px; margin-top: 20px;`
	);

	console.groupEnd();
};
