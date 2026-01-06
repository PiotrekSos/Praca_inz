import type { Block, Connection } from "../types";

export const evaluateCircuit = (blocks: Block[], connections: Connection[]) => {
	const newBlocks = blocks.map((b) => ({ ...b, inputs: [...b.inputs] }));

	for (const b of newBlocks) {
		switch (b.type) {
			case "ONE":
				b.outputs[0] = 1;
				break;
			case "ZERO":
				b.outputs[0] = 0;
				break;
			case "D_FLIPFLOP":
			case "T_FLIPFLOP":
			case "JK_FLIPFLOP":
			case "SR_FLIPFLOP": {
				if (!("state" in b)) b.state = 0;
				b.outputs[0] = Number(b.state);
				b.outputs[1] = Number(!b.state);
				break;
			}
			default:
				break;
		}
	}

	for (let i = 0; i < newBlocks.length; i++) {
		for (const b of newBlocks) {
			if (!["ONE", "ZERO", "TOGGLE", "CLOCK", "LABEL"].includes(b.type)) {
				b.inputs = b.inputs.map(() => 0);
			}
		}

		for (const c of connections) {
			const from = newBlocks.find((b) => b.id === c.from.blockId);
			const to = newBlocks.find((b) => b.id === c.to.blockId);
			if (!from || !to) continue;
			if (to.inputs[c.to.inputIndex] !== undefined) {
				to.inputs[c.to.inputIndex] =
					from.outputs[c.from.outputIndex || 0];
			}
		}

		for (const b of newBlocks) {
			switch (b.type) {
				case "AND":
					b.outputs[0] = b.inputs.every((v) => v === 1) ? 1 : 0;
					break;
				case "OR":
					b.outputs[0] = b.inputs.some((v) => v === 1) ? 1 : 0;
					break;
				case "NOT":
					b.outputs[0] = b.inputs[0] ? 0 : 1;
					break;
				case "NAND":
					b.outputs[0] = b.inputs.every((v) => v === 1) ? 0 : 1;
					break;
				case "NOR":
					b.outputs[0] = b.inputs.some((v) => v === 1) ? 0 : 1;
					break;
				case "XOR":
					b.outputs[0] = b.inputs.reduce((a, b) => a ^ b, 0);
					break;
				case "XNOR":
					b.outputs[0] = b.inputs.reduce((a, b) => a ^ b, 0) ? 0 : 1;
					break;
				case "BUFFER":
					b.outputs[0] = b.inputs[0] || 0;
					break;

				case "D_FLIPFLOP": {
					const [D, CLK, S_low, R_low] = b.inputs;
					if (!("state" in b)) b.state = 0;
					if (!("prevClock" in b)) b.prevClock = 0;

					if (R_low === 0) b.state = 0;
					else if (S_low === 0) b.state = 1;
					else if (CLK === 1 && b.prevClock === 0) b.state = D;

					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					b.prevClock = CLK;
					break;
				}
				case "T_FLIPFLOP": {
					const [T, CLK, S_low, R_low] = b.inputs;
					if (!("state" in b)) b.state = 0;
					if (!("prevClock" in b)) b.prevClock = 0;

					if (R_low === 0) b.state = 0;
					else if (S_low === 0) b.state = 1;
					else if (CLK === 1 && T === 1) b.state = b.state ? 0 : 1;

					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					b.prevClock = CLK;
					break;
				}
				case "JK_FLIPFLOP": {
					const [J, K, CLK, S_low, R_low] = b.inputs;
					if (!("state" in b)) b.state = 0;
					if (!("prevClock" in b)) b.prevClock = 0;

					if (R_low === 0) b.state = 0;
					else if (S_low === 0) b.state = 1;
					else if (CLK === 1 && b.prevClock === 0) {
						if (J === 0 && K === 1) b.state = 0;
						else if (J === 1 && K === 0) b.state = 1;
						else if (J === 1 && K === 1) b.state = b.state ? 0 : 1;
					}

					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					b.prevClock = CLK;
					break;
				}
				case "SR_FLIPFLOP": {
					const [S, R, CLK] = b.inputs;

					if (!("state" in b)) b.state = 0;
					if (!("prevClock" in b)) b.prevClock = 0;

					if (CLK === 1 && b.prevClock === 0) {
						if (S === 1 && R === 0) {
							b.state = 1;
						} else if (S === 0 && R === 1) {
							b.state = 0;
						}
					}

					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);

					b.prevClock = CLK;
					break;
				}

				case "RAM_16x4": {
					const dataIn = b.inputs.slice(0, 4);
					const addressIn = b.inputs.slice(4, 8);
					const CS_low = b.inputs[8] ?? 1;
					const WE_low = b.inputs[9] ?? 1;

					if (!b.memory) b.memory = new Uint8Array(16);

					let address = 0;
					if (addressIn[0] === 1) address |= 1;
					if (addressIn[1] === 1) address |= 2;
					if (addressIn[2] === 1) address |= 4;
					if (addressIn[3] === 1) address |= 8;

					if (CS_low === 0 && WE_low === 0) {
						let dataNibble = 0;
						if (dataIn[0] === 1) dataNibble |= 1;
						if (dataIn[1] === 1) dataNibble |= 2;
						if (dataIn[2] === 1) dataNibble |= 4;
						if (dataIn[3] === 1) dataNibble |= 8;

						b.memory[address] = dataNibble;
						b.outputs.fill(1);
					} else if (CS_low === 0 && WE_low === 1) {
						const dataNibble = b.memory[address];
						b.outputs[0] = (dataNibble >> 0) & 1 ? 0 : 1;
						b.outputs[1] = (dataNibble >> 1) & 1 ? 0 : 1;
						b.outputs[2] = (dataNibble >> 2) & 1 ? 0 : 1;
						b.outputs[3] = (dataNibble >> 3) & 1 ? 0 : 1;
					} else {
						b.outputs.fill(1);
					}
					break;
				}

				case "MUX4": {
					const dataInputs = b.inputs.slice(0, 4);
					const selectBits = b.inputs.slice(4, 6);
					const E_low = b.inputs[6] ?? 1;
					if (E_low === 0) {
						const sel = (selectBits[0] << 1) | selectBits[1];
						const selectedValue = dataInputs[sel] ?? 0;
						b.outputs[0] = selectedValue === 1 ? 0 : 1;
					} else {
						b.outputs[0] = 1;
					}
					break;
				}
				case "MUX16": {
					const dataInputs = b.inputs.slice(0, 16);
					const selectBits = b.inputs.slice(16, 20);
					const E_low = b.inputs[20] ?? 1;
					if (E_low === 0) {
						const sel =
							(selectBits[0] << 3) |
							(selectBits[1] << 2) |
							(selectBits[2] << 1) |
							selectBits[3];
						const selectedValue = dataInputs[sel] ?? 0;
						b.outputs[0] = selectedValue === 1 ? 0 : 1;
					} else {
						b.outputs[0] = 1;
					}
					break;
				}
				case "DEMUX4": {
					const IN = b.inputs[0];
					const selectBits = b.inputs.slice(1, 3);
					const E_low = b.inputs[3] ?? 1;
					b.outputs = [1, 1, 1, 1];
					if (E_low === 0) {
						const sel = (selectBits[0] << 1) | selectBits[1];
						b.outputs[sel] = IN === 1 ? 0 : 1;
					}
					break;
				}
				case "DEMUX16": {
					const IN = b.inputs[0];
					const selectBits = b.inputs.slice(1, 5);
					const E_low = b.inputs[5] ?? 1;
					b.outputs = new Array(16).fill(1);
					if (E_low === 0) {
						const sel =
							(selectBits[0] << 3) |
							(selectBits[1] << 2) |
							(selectBits[2] << 1) |
							selectBits[3];
						b.outputs[sel] = IN === 1 ? 0 : 1;
					}
					break;
				}
				case "NAND_4":
				case "NAND_8":
					b.outputs[0] = b.inputs.every((v) => v === 1) ? 0 : 1;
					break;
				case "NOR_4":
				case "NOR_8":
					b.outputs[0] = b.inputs.some((v) => v === 1) ? 0 : 1;
					break;
			}
		}
	}
	return newBlocks;
};
