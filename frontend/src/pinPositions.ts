import type { Block } from "./types";

export const getInputPinPosition = (block: Block, inputIndex: number) => {
	const baseX = block.x;
	const baseY = block.y;

	switch (block.type) {
		case "MUX4": {
			if (inputIndex < 4) {
				return {
					x: baseX - 7 + 7,
					y: baseY + (18 + inputIndex * 18) + 7,
				};
			}
			if (inputIndex < 6) {
				const ctrlIdx = inputIndex - 4;
				return { x: baseX + (43 + ctrlIdx * 20) + 7, y: baseY - 6 + 7 };
			}
			if (inputIndex === 6) {
				return { x: baseX + 53 + 7, y: baseY + 110 - 7 + 6 };
			}
			break;
		}

		case "MUX16": {
			if (inputIndex < 16) {
				return {
					x: baseX - 7 + 7,
					y: baseY + (17 + inputIndex * 18.5) + 7,
				};
			}
			if (inputIndex < 20) {
				const ctrlIdx = inputIndex - 16;
				return { x: baseX + (34 + ctrlIdx * 15) + 6, y: baseY - 6 + 7 };
			}
			if (inputIndex === 20) {
				return { x: baseX + 53 + 7, y: baseY + 340 - 7 + 6 };
			}
			break;
		}

		case "DEMUX4": {
			if (inputIndex === 0) {
				return { x: baseX - 7 + 7, y: baseY + 43 + 7 };
			}
			if (inputIndex < 3) {
				const ctrlIdx = inputIndex - 1;
				return { x: baseX + (43 + ctrlIdx * 20) + 7, y: baseY - 6 + 7 };
			}
			if (inputIndex === 3) {
				return { x: baseX + 53 + 7, y: baseY + 110 - 7 + 6 };
			}
			break;
		}

		case "DEMUX16": {
			if (inputIndex === 0) {
				return { x: baseX - 7 + 7, y: baseY + 158 + 7 };
			}
			if (inputIndex < 5) {
				const ctrlIdx = inputIndex - 1;
				return { x: baseX + (34 + ctrlIdx * 15) + 6, y: baseY - 6 + 7 };
			}
			if (inputIndex === 5) {
				return { x: baseX + 53 + 7, y: baseY + 340 - 7 + 7 };
			}
			break;
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP": {
			if (inputIndex < 2) {
				return {
					x: baseX + 4 + 7,
					y: baseY + (28 + inputIndex * 15) + 7,
				};
			}
			if (inputIndex === 2) {
				return { x: baseX + 53 + 7, y: baseY - 1 + 7 };
			}
			if (inputIndex === 3) {
				return { x: baseX + 53 + 7, y: baseY + 67 + 7 };
			}
			break;
		}

		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			if (inputIndex < 3) {
				return {
					x: baseX + 4 + 7,
					y: baseY + (28 + inputIndex * 15) + 7,
				};
			}
			if (inputIndex === 3) {
				return { x: baseX + 53 + 7, y: baseY + 6 };
			}
			if (inputIndex === 4) {
				return { x: baseX + 53 + 7, y: baseY + 87 + 7 };
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
				x: baseX + 1,
				y: baseY + (inputIndex === 0 ? 13 : 33) + 7,
			};
		}

		case "NOT":
		case "BUFFER": {
			return {
				x: baseX,
				y: baseY + 23 + 7,
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
			if (inputIndex < 4) {
				return {
					x: baseX + 1,
					y: baseY + (23 + inputIndex * 15) + 7,
				};
			}
			if (inputIndex < 8) {
				const addrIdx = inputIndex - 4;
				return { x: baseX + 2, y: baseY + (93 + addrIdx * 15) + 7 };
			}
			if (inputIndex === 8) {
				return { x: baseX + 62.3 + 8, y: baseY - 6 + 7 };
			}
			if (inputIndex === 9) {
				return { x: baseX + 63.3 + 7, y: baseY + 173 + 5 };
			}
			break;
		}

		default: {
			return {
				x: baseX + -6 + 7,
				y: baseY + (23 + inputIndex * 20) + 7,
			};
		}
	}
};

export const getOutputPinPosition = (block: Block, outputIndex: number = 0) => {
	const baseX = block.x;
	const baseY = block.y;

	switch (block.type) {
		case "MUX4": {
			return {
				x: baseX + 120 - 8 + 7,
				y: baseY + 43 + 7,
			};
		}

		case "MUX16": {
			return {
				x: baseX + 120 - 8 + 7,
				y: baseY + 158.5 + 7,
			};
		}

		case "DEMUX4": {
			return {
				x: baseX + 120 - 8 + 7,
				y: baseY + (18 + outputIndex * 18) + 7,
			};
		}

		case "DEMUX16": {
			return {
				x: baseX + 120 - 8 + 7,
				y: baseY + (20 + outputIndex * 18.5) + 5,
			};
		}

		case "D_FLIPFLOP":
		case "T_FLIPFLOP": {
			if (outputIndex === 0) {
				return {
					x: baseX + 100 + 2 + 7,
					y: baseY + 28 + 7,
				};
			} else {
				return {
					x: baseX + 100 + 2 + 7,
					y: baseY + 43 + 7,
				};
			}
		}

		case "JK_FLIPFLOP":
		case "SR_FLIPFLOP": {
			if (outputIndex === 0) {
				return {
					x: baseX + 100 + 2 + 7,
					y: baseY + 28 + 7,
				};
			} else {
				return {
					x: baseX + 100 + 2 + 7,
					y: baseY + 58 + 7,
				};
			}
		}

		case "NAND_4":
		case "NOR_4": {
			return {
				x: baseX + 120 - 8 + 7,
				y: baseY + 43 + 7,
			};
		}

		case "NAND_8":
		case "NOR_8": {
			return {
				x: baseX + 160 - 1,
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
				x: baseX + 100,
				y: baseY + 23 + 7,
			};
		}

		case "RAM_16x4": {
			return {
				x: baseX + 139,
				y: baseY + (58 + outputIndex * 15) + 7,
			};
		}

		default: {
			return {
				x: baseX + 100 - 7 + 7,
				y: baseY + 23 + 7,
			};
		}
	}
};
