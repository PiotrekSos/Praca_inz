import type { Block } from "../types";

type PinConfig = {
	type: "input" | "output";
	index: number;
	style: React.CSSProperties;
};

export const getBlockPinLayout = (block: Block): PinConfig[] => {
	const pins: PinConfig[] = [];

	switch (block.type) {
		// --- ŹRÓDŁA SYGNAŁU (Teraz mają wyjścia!) ---
		case "CLOCK":
		case "ONE":
		case "ZERO":
		case "TOGGLE": {
			// Te bloki mają jedno wyjście po prawej stronie
			pins.push({
				type: "output",
				index: 0,
				style: { right: -8, top: 23 },
			});
			break;
		}

		// --- WYJŚCIA (LAMP) ---
		case "LAMP": {
			// Lampa ma jedno wejście po lewej
			pins.push({
				type: "input",
				index: 0,
				style: { left: -8, top: 23 },
			});
			break;
		}

		// --- PAMIĘĆ RAM (Poprawione pozycje) ---
		case "RAM_16x4": {
			// D0-D3 (Wejścia danych)
			for (let i = 0; i < 4; i++) {
				pins.push({
					type: "input",
					index: i,
					style: { left: -6, top: 23 + i * 15 },
				});
			}
			// A0-A3 (Adresy)
			for (let i = 0; i < 4; i++) {
				pins.push({
					type: "input",
					index: 4 + i,
					style: { left: -6, top: 93 + i * 15 },
				});
			}
			// !CS (Góra)
			pins.push({
				type: "input",
				index: 8,
				style: { left: 63, top: -7 },
			});
			// !WE (Dół)
			pins.push({
				type: "input",
				index: 9,
				style: { left: 63, top: 173 },
			}); // 180 height - 7

			// Q0-Q3 (Wyjścia) - Przywrócono "right: -47" z Twojego oryginalnego kodu
			for (let i = 0; i < 4; i++) {
				pins.push({
					type: "output",
					index: i,
					style: { right: -7, top: 58 + i * 15 },
				});
			}
			break;
		}

		// --- MULTIPLEKSERY ---
		case "MUX4": {
			for (let i = 0; i < 4; i++)
				pins.push({
					type: "input",
					index: i,
					style: { left: -7, top: 18 + i * 18 },
				});
			for (let i = 0; i < 2; i++)
				pins.push({
					type: "input",
					index: 4 + i,
					style: { left: 43 + i * 20, top: -7 },
				});
			pins.push({
				type: "input",
				index: 6,
				style: { left: 53, top: 103 },
			});
			pins.push({
				type: "output",
				index: 0,
				style: { right: -26, top: 43 },
			});
			break;
		}
		case "MUX16": {
			for (let i = 0; i < 16; i++)
				pins.push({
					type: "input",
					index: i,
					style: { left: -7, top: 17 + i * 18.5 },
				});
			for (let i = 0; i < 4; i++)
				pins.push({
					type: "input",
					index: 16 + i,
					style: { left: 33 + i * 15, top: -7 },
				});
			pins.push({
				type: "input",
				index: 20,
				style: { left: 53, top: 333 },
			});
			pins.push({
				type: "output",
				index: 0,
				style: { right: -26, top: 158 },
			});
			break;
		}

		// --- DEMULTIPLEKSERY ---
		case "DEMUX4": {
			pins.push({
				type: "input",
				index: 0,
				style: { left: -7, top: 43 },
			});
			for (let i = 0; i < 2; i++)
				pins.push({
					type: "input",
					index: 1 + i,
					style: { left: 43 + i * 20, top: -7 },
				});
			pins.push({
				type: "input",
				index: 3,
				style: { left: 53, top: 103 },
			});
			for (let i = 0; i < 4; i++)
				pins.push({
					type: "output",
					index: i,
					style: { right: -26, top: 18 + i * 18 },
				});
			break;
		}
		case "DEMUX16": {
			pins.push({
				type: "input",
				index: 0,
				style: { left: -7, top: 158 },
			});
			for (let i = 0; i < 4; i++)
				pins.push({
					type: "input",
					index: 1 + i,
					style: { left: 33 + i * 15, top: -7 },
				});
			pins.push({
				type: "input",
				index: 5,
				style: { left: 53, top: 333 },
			});
			for (let i = 0; i < 16; i++)
				pins.push({
					type: "output",
					index: i,
					style: { right: -26, top: 18 + i * 18.5 },
				});
			break;
		}

		// --- PRZERZUTNIKI ---
		case "D_FLIPFLOP":
		case "T_FLIPFLOP": {
			pins.push({ type: "input", index: 0, style: { left: 4, top: 28 } });
			pins.push({ type: "input", index: 1, style: { left: 4, top: 43 } });
			pins.push({
				type: "input",
				index: 2,
				style: { left: 53, top: -2 },
			});
			pins.push({
				type: "input",
				index: 3,
				style: { left: 53, bottom: -20 },
			});
			pins.push({
				type: "output",
				index: 0,
				style: { right: -16, top: 28 },
			});
			pins.push({
				type: "output",
				index: 1,
				style: { right: -16, top: 43 },
			});
			break;
		}
		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			pins.push({ type: "input", index: 0, style: { left: 4, top: 28 } });
			pins.push({ type: "input", index: 1, style: { left: 4, top: 43 } });
			pins.push({ type: "input", index: 2, style: { left: 4, top: 58 } });
			pins.push({
				type: "input",
				index: 3,
				style: { left: 53, top: -2 },
			});
			pins.push({
				type: "input",
				index: 4,
				style: { left: 53, bottom: -40 },
			});
			pins.push({
				type: "output",
				index: 0,
				style: { right: -16, top: 28 },
			});
			pins.push({
				type: "output",
				index: 1,
				style: { right: -16, top: 58 },
			});
			break;
		}

		// --- BRAMKI WIELOWEJŚCIOWE ---
		case "NAND_4":
		case "NOR_4": {
			block.inputs.forEach((_, i) =>
				pins.push({
					type: "input",
					index: i,
					style: { left: -7, top: 18 + i * 17 },
				})
			);
			pins.push({
				type: "output",
				index: 0,
				style: { right: -7, top: 43 },
			});
			break;
		}
		case "NAND_8":
		case "NOR_8": {
			block.inputs.forEach((_, i) =>
				pins.push({
					type: "input",
					index: i,
					style: { left: -7, top: 21 + i * 15 },
				})
			);
			pins.push({
				type: "output",
				index: 0,
				style: { right: -7, top: 73 },
			});
			break;
		}

		// --- ETYKIETA (Bez pinów) ---
		case "LABEL":
			break;

		// --- STANDARDOWE BRAMKI (AND, OR, NOT, BUFFER itp.) ---
		default: {
			// Inputs
			block.inputs.forEach((_, i) => {
				pins.push({
					type: "input",
					index: i,
					// Dla bramek 2-wejściowych centrujemy (13/33), dla 1-wejściowych (23)
					style: {
						left: -7,
						top: block.inputs.length === 1 ? 23 : i === 0 ? 13 : 33,
					},
				});
			});
			// Output
			pins.push({
				type: "output",
				index: 0,
				style: { right: -8, top: 23 },
			});
			break;
		}
	}
	return pins;
};
