import { evaluateCircuit } from "../logic/circuitSolver";
import type { Block, Connection } from "../types";

// Pomocnicza funkcja do tworzenia łańcucha bramek
// [Generator 1] -> [NOT] -> [NOT] -> ... -> [NOT]
const generateStressCircuit = (gateCount: number) => {
	const blocks: Block[] = [];
	const connections: Connection[] = [];

	// 1. Źródło sygnału (Generator)
	blocks.push({
		id: 0,
		type: "ONE",
		x: 0,
		y: 0,
		inputs: [],
		outputs: [1],
	});

	// 2. Generowanie bramek NOT
	for (let i = 1; i <= gateCount; i++) {
		blocks.push({
			id: i,
			type: "NOT", // Używamy NOT bo wymusza zmianę stanu
			x: i * 50,
			y: 0,
			inputs: [0],
			outputs: [0],
		});

		// Łączenie poprzedniej bramki z obecną
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

	// Definicja scenariuszy (Liczba bramek)
	const scenarios = [5, 10, 50, 100, 200, 500, 1000];
	const results: any[] = [];

	scenarios.forEach((count) => {
		// 1. Przygotowanie środowiska
		const { blocks, connections } = generateStressCircuit(count);

		// 2. Pomiar czasu
		// Wykonujemy 100 symulacji dla każdego układu, aby wyciągnąć średnią
		// i wyeliminować chwilowe lagi przeglądarki.
		const iterations = 10;
		const start = performance.now();

		for (let i = 0; i < iterations; i++) {
			// Symulujemy zmianę na wejściu co drugą iterację, żeby wymusić przeliczenia
			blocks[0].outputs[0] = i % 2;
			evaluateCircuit(blocks, connections);
		}

		const end = performance.now();

		// 3. Obliczenia
		const totalTime = end - start;
		const avgTimePerTick = totalTime / iterations;

		// Czy jest płynnie? (Mniej niż 16ms = 60 FPS)
		const status =
			avgTimePerTick < 16 ? "✅ PŁYNNIE (60FPS)" : "⚠️ SPADEK FPS";

		results.push({
			"Liczba Elementów": count,
			"Liczba Połączeń": count, // W łańcuchu tyle samo co bramek
			"Średni Czas (ms)": avgTimePerTick.toFixed(4),
			Status: status,
		});
	});

	// Wyświetlenie tabeli w konsoli
	console.table(results);
	console.groupEnd();
};
