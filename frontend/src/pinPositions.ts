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
					x: baseX + -6 + 7,
					y: baseY + (18 + inputIndex * 18) + 7,
				};
			}
			// 2 wejścia sterujące (4-5) U GÓRY
			// Patrzę na SVG: tekst A0/A1 ma y="8", więc piny powinny być bardzo wysoko
			const ctrlIdx = inputIndex - 4;
			return {
				x: baseX + (43 + ctrlIdx * 20) + 7,
				y: baseY + 1, // tuż pod górną krawędzią (y="8" w SVG dla tekstu)
			};
		}

		case "MUX16": {
			// 16 wejść danych (0-15) po lewej
			if (inputIndex < 16) {
				return {
					x: baseX - 4 + 5, // pin ma width: 10
					y: baseY + (20.5 + inputIndex * 18.5) + 5,
				};
			}
			// 4 wejścia sterujące (16-19) od dołu
			const ctrlIdx = inputIndex - 16;
			return {
				x: baseX + (34 + ctrlIdx * 15) + 6, // pin ma width: 12
				y: baseY + 2, // bottom: 60
			};
		}

		case "DEMUX4": {
			// Pojedyncze wejście danych (0)
			if (inputIndex === 0) {
				return {
					x: baseX + 2,
					y: baseY + 51,
				};
			}
			// 2 wejścia sterujące (1-2) od dołu
			const ctrlIdx = inputIndex - 1;
			return {
				x: baseX + (51 + ctrlIdx * 20),
				y: baseY + 1, // bottom: 58
			};
		}

		case "DEMUX16": {
			// Pojedyncze wejście danych (0)
			if (inputIndex === 0) {
				return {
					x: baseX + 1,
					y: baseY + 165,
				};
			}
			// 4 wejścia sterujące (1-4) od dołu
			const ctrlIdx = inputIndex - 1;
			return {
				x: baseX + (40 + ctrlIdx * 15),
				y: baseY + 1, // bottom: 60
			};
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP":
		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			return {
				x: baseX + 4 + 7,
				y: baseY + (28 + inputIndex * 15) + 7,
			};
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
				y: baseY + (21 + inputIndex * 15) + 7,
			};
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

		// Standardowe bramki
		default: {
			return {
				x: baseX + 100 - 7 + 7, // right: -8
				y: baseY + 23 + 7,
			};
		}
	}
};
