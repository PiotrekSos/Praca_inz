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
					x: baseX + -8 + 7,
					y: baseY + (17 + inputIndex * 18) + 7,
				};
			}
			// 2 wejścia sterujące (4-5) U GÓRY
			// Patrzę na SVG: tekst A0/A1 ma y="8", więc piny powinny być bardzo wysoko
			const ctrlIdx = inputIndex - 4;
			return {
				x: baseX + (30 + ctrlIdx * 25) + 7,
				y: baseY + 7, // tuż pod górną krawędzią (y="8" w SVG dla tekstu)
			};
		}

		case "MUX16": {
			// 16 wejść danych (0-15) po lewej
			if (inputIndex < 16) {
				return {
					x: baseX + 0 + 5, // pin ma width: 10
					y: baseY + (17 + inputIndex * 18.5) + 5,
				};
			}
			// 4 wejścia sterujące (16-19) od dołu
			const ctrlIdx = inputIndex - 16;
			return {
				x: baseX + (20 + ctrlIdx * 15) + 6, // pin ma width: 12
				y: baseY + 320 - 60 + 6, // bottom: 60
			};
		}

		case "DEMUX4": {
			// Pojedyncze wejście danych (0)
			if (inputIndex === 0) {
				return {
					x: baseX + -8,
					y: baseY + 45,
				};
			}
			// 2 wejścia sterujące (1-2) od dołu
			const ctrlIdx = inputIndex - 1;
			return {
				x: baseX + (35 + ctrlIdx * 20),
				y: baseY + 100 - 58, // bottom: 58
			};
		}

		case "DEMUX16": {
			// Pojedyncze wejście danych (0)
			if (inputIndex === 0) {
				return {
					x: baseX + -8,
					y: baseY + 150,
				};
			}
			// 4 wejścia sterujące (1-4) od dołu
			const ctrlIdx = inputIndex - 1;
			return {
				x: baseX + (20 + ctrlIdx * 15),
				y: baseY + 320 - 60, // bottom: 60
			};
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP":
		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			return {
				x: baseX + -8 + 7,
				y: baseY + (20 + inputIndex * 20) + 7,
			};
		}

		// Standardowe bramki
		default: {
			return {
				x: baseX + -8 + 7,
				y: baseY + (18 + inputIndex * 20) + 7,
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
				x: baseX + 100 - 8 + 7, // right: -8
				y: baseY + 45 + 7,
			};
		}

		case "MUX16": {
			return {
				x: baseX + 100 - 8 + 7, // right: -8
				y: baseY + 150 + 7,
			};
		}

		case "DEMUX4": {
			// 4 wyjścia po prawej stronie
			return {
				x: baseX + 100 - 8 + 7, // right: -8
				y: baseY + (17 + outputIndex * 18) + 7,
			};
		}

		case "DEMUX16": {
			// 16 wyjść po prawej stronie
			return {
				x: baseX + 100 - 8 + 5, // right: -8, pin width: 10
				y: baseY + (17 + outputIndex * 18.5) + 5,
			};
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP": {
			// Q na górze (index 0), ¬Q na dole (index 1)
			if (outputIndex === 0) {
				return {
					x: baseX + 100 - 8 + 7, // right: -8
					y: baseY + 25 + 7,
				};
			} else {
				return {
					x: baseX + 100 - 8 + 7, // right: -8
					y: baseY + 45 + 7,
				};
			}
		}

		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			// Q na górze (index 0), ¬Q na dole (index 1)
			if (outputIndex === 0) {
				return {
					x: baseX + 100 - 8 + 7, // right: -8
					y: baseY + 25 + 7,
				};
			} else {
				return {
					x: baseX + 100 - 8 + 7, // right: -8
					y: baseY + 55 + 7,
				};
			}
		}

		case "NAND_4":
		case "NOR_4": {
			return {
				x: baseX + 120 - 40 + 7, // right: -40
				y: baseY + 43 + 7,
			};
		}

		case "NAND_8":
		case "NOR_8": {
			return {
				x: baseX + 160 - 10 + 7, // right: -10
				y: baseY + 83 + 7,
			};
		}

		// Standardowe bramki
		default: {
			return {
				x: baseX + 100 - 8 + 7, // right: -8
				y: baseY + 28 + 7,
			};
		}
	}
};
