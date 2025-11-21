import type { Block } from "./types";

// Funkcja do obliczania pozycji pinu wejściowego
export const getInputPinPosition = (block: Block, inputIndex: number) => {
	const baseX = block.x;
	const baseY = block.y;

	switch (block.type) {
		case "MUX4": {
			// 4 wejścia danych (0-3) po lewej stronie
			if (inputIndex < 4) {
				return {
					x: baseX - 7 + 7,
					y: baseY + (18 + inputIndex * 18) + 7,
				};
			}
			// 2 wejścia sterujące (4-5) U GÓRY
			if (inputIndex < 6) {
				const ctrlIdx = inputIndex - 4;
				return { x: baseX + (43 + ctrlIdx * 20) + 7, y: baseY - 6 + 7 }; // Było y: 1
			}
			// 1 wejście !E (6) U DOŁU
			if (inputIndex === 6) {
				return { x: baseX + 53 + 7, y: baseY + 110 - 7 + 6 }; // 100(h) - 7
			}
			break;
		}

		case "MUX16": {
			// 16 wejść danych (0-15) po lewej
			if (inputIndex < 16) {
				return {
					x: baseX - 7 + 7,
					y: baseY + (17 + inputIndex * 18.5) + 7,
				};
			}
			// 4 wejścia sterujące (16-19) od góry
			if (inputIndex < 20) {
				const ctrlIdx = inputIndex - 16;
				return { x: baseX + (34 + ctrlIdx * 15) + 6, y: baseY - 6 + 7 };
			}
			// 1 wejście !E (20) U DOŁU
			if (inputIndex === 20) {
				return { x: baseX + 53 + 7, y: baseY + 340 - 7 + 6 }; // 330(h) - 7
			}
			break;
		}

		case "DEMUX4": {
			// Pojedyncze wejście danych (0)
			if (inputIndex === 0) {
				return { x: baseX - 7 + 7, y: baseY + 43 + 7 };
			}
			// 2 wejścia sterujące (1-2) od góry
			if (inputIndex < 3) {
				const ctrlIdx = inputIndex - 1;
				return { x: baseX + (43 + ctrlIdx * 20) + 7, y: baseY - 6 + 7 };
			}
			// 1 wejście !E (3) U DOŁU
			if (inputIndex === 3) {
				return { x: baseX + 53 + 7, y: baseY + 110 - 7 + 6 }; // 100(h) - 7
			}
			break;
		}

		case "DEMUX16": {
			// Pojedyncze wejście danych (0)
			if (inputIndex === 0) {
				return { x: baseX - 7 + 7, y: baseY + 158 + 7 };
			}
			// 4 wejścia sterujące (1-4) od góry
			if (inputIndex < 5) {
				const ctrlIdx = inputIndex - 1;
				return { x: baseX + (34 + ctrlIdx * 15) + 6, y: baseY - 6 + 7 };
			}
			// 1 wejście !E (5) U DOŁU
			if (inputIndex === 5) {
				return { x: baseX + 53 + 7, y: baseY + 340 - 7 + 7 }; // 330(h) - 7
			}
			break;
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP": {
			// inputIndex 0: D/T, 1: CLK
			if (inputIndex < 2) {
				return {
					x: baseX + 4 + 7,
					y: baseY + (28 + inputIndex * 15) + 7,
				};
			}
			// inputIndex 2: S (góra)
			if (inputIndex === 2) {
				return { x: baseX + 53 + 7, y: baseY - 1 + 7 };
			}
			// inputIndex 3: R (dół)
			if (inputIndex === 3) {
				return { x: baseX + 53 + 7, y: baseY + 67 + 7 }; // 60 = height bloku
			}
			break; // Powrót do default jeśli coś pójdzie nie tak
		}

		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			// inputIndex 0: J/S, 1: K/R, 2: CLK
			if (inputIndex < 3) {
				return {
					x: baseX + 4 + 7,
					y: baseY + (28 + inputIndex * 15) + 7,
				};
			}
			// inputIndex 3: S (góra)
			if (inputIndex === 3) {
				return { x: baseX + 53 + 7, y: baseY + 6 };
			}
			// inputIndex 4: R (dół)
			if (inputIndex === 4) {
				return { x: baseX + 53 + 7, y: baseY + 87 + 7 }; // 60 = height bloku
			}
			break;
		}

		case "AND":
		case "OR":
		case "NAND":
		case "NOR":
		case "XOR":
		case "XNOR": {
			return {
				x: baseX + 1, // pin lekko z lewej
				y: baseY + (inputIndex === 0 ? 13 : 33) + 7, // dwa wejścia w środkowej części
			};
		}

		case "NOT":
		case "BUFFER": {
			return {
				x: baseX, // pin lekko z lewej
				y: baseY + 23 + 7, // dwa wejścia w środkowej części
			};
		}

		case "NAND_4":
		case "NOR_4": {
			return {
				x: baseX + -6 + 7,
				y: baseY + (18 + inputIndex * 17) + 7,
			};
		}

		case "NAND_8":
		case "NOR_8": {
			return {
				x: baseX + -6 + 7,
				y: baseY + (21.5 + inputIndex * 15) + 7,
			};
		}

		case "RAM_16x4": {
			// D0-D3
			if (inputIndex < 4) {
				return {
					x: baseX + 1,
					y: baseY + (23 + inputIndex * 15) + 7,
				};
			}
			// A0-A3
			if (inputIndex < 8) {
				const addrIdx = inputIndex - 4;
				return { x: baseX + 2, y: baseY + (93 + addrIdx * 15) + 7 };
			}
			// CS
			if (inputIndex === 8) {
				return { x: baseX + 62.3 + 8, y: baseY - 6 + 7 };
			}
			// WE
			if (inputIndex === 9) {
				return { x: baseX + 63.3 + 7, y: baseY + 173 + 5 }; // 180 (height) - 7
			}
			break; // Domyślna obsługa (np. dla CLK, jeśli istnieje)
		}

		// Standardowe bramki
		default: {
			return {
				x: baseX + -6 + 7,
				y: baseY + (23 + inputIndex * 20) + 7,
			};
		}
	}
};

// Funkcja do obliczania pozycji pinu wyjściowego
export const getOutputPinPosition = (block: Block, outputIndex: number = 0) => {
	const baseX = block.x;
	const baseY = block.y;

	switch (block.type) {
		case "MUX4": {
			return {
				x: baseX + 120 - 8 + 7, // right: -8
				y: baseY + 43 + 7,
			};
		}

		case "MUX16": {
			return {
				x: baseX + 120 - 8 + 7, // right: -8
				y: baseY + 158.5 + 7,
			};
		}

		case "DEMUX4": {
			// 4 wyjścia po prawej stronie
			return {
				x: baseX + 120 - 8 + 7, // right: -8
				y: baseY + (18 + outputIndex * 18) + 7,
			};
		}

		case "DEMUX16": {
			// 16 wyjść po prawej stronie
			return {
				x: baseX + 120 - 8 + 7, // right: -8, pin width: 10
				y: baseY + (20 + outputIndex * 18.5) + 5,
			};
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP": {
			// Q na górze (index 0), ¬Q na dole (index 1)
			if (outputIndex === 0) {
				return {
					x: baseX + 100 + 2 + 7, // right: -8
					y: baseY + 28 + 7,
				};
			} else {
				return {
					x: baseX + 100 + 2 + 7, // right: -8
					y: baseY + 43 + 7,
				};
			}
		}

		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			// Q na górze (index 0), ¬Q na dole (index 1)
			if (outputIndex === 0) {
				return {
					x: baseX + 100 + 2 + 7, // right: -8
					y: baseY + 28 + 7,
				};
			} else {
				return {
					x: baseX + 100 + 2 + 7, // right: -8
					y: baseY + 58 + 7,
				};
			}
		}

		case "NAND_4":
		case "NOR_4": {
			return {
				x: baseX + 120 - 8 + 7, // right: -40
				y: baseY + 43 + 7,
			};
		}

		case "NAND_8":
		case "NOR_8": {
			return {
				x: baseX + 160 - 1, // right: -10
				y: baseY + 73 + 7,
			};
		}

		case "AND":
		case "OR":
		case "NOT":
		case "BUFFER":
		case "NAND":
		case "NOR":
		case "XOR":
		case "XNOR": {
			return {
				x: baseX + 100, // prawa krawędź
				y: baseY + 23 + 7, // wyjście centralnie na środku
			};
		}

		case "RAM_16x4": {
			// 4 wyjścia Q0-Q3
			return {
				x: baseX + 139, // 140 (width) - 47 (right)
				y: baseY + (58 + outputIndex * 15) + 7,
			};
		}

		// Standardowe bramki
		default: {
			return {
				x: baseX + 100 - 7 + 7, // right: -8
				y: baseY + 23 + 7,
			};
		}
	}
};
