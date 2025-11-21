import type { BlockType } from "../types";

export const getBlockConfig = (type: BlockType) => {
	let inputCount = 2;
	let outputCount = 1;

	if (["NOT", "BUFFER", "LAMP"].includes(type)) inputCount = 1;
	else if (["CLOCK", "ONE", "ZERO", "TOGGLE"].includes(type)) inputCount = 0;
	else if (["SR_FLIPFLOP"].includes(type)) inputCount = 3;
	else if (
		["NAND_4", "NOR_4", "D_FLIPFLOP", "T_FLIPFLOP", "DEMUX4"].includes(type)
	)
		inputCount = 4;
	else if (["JK_FLIPFLOP"].includes(type)) inputCount = 5;
	else if (["DEMUX16"].includes(type)) inputCount = 6;
	else if (["MUX4"].includes(type)) inputCount = 7;
	else if (["NAND_8", "NOR_8"].includes(type)) inputCount = 8;
	else if (["RAM_16x4"].includes(type)) inputCount = 10;
	else if (["MUX16"].includes(type)) inputCount = 21;
	else if (["LABEL"].includes(type)) inputCount = 0;

	if (
		["JK_FLIPFLOP", "SR_FLIPFLOP", "D_FLIPFLOP", "T_FLIPFLOP"].includes(
			type
		)
	)
		outputCount = 2;
	else if (["LAMP", "LABEL"].includes(type)) outputCount = 0;
	else if (["DEMUX4", "RAM_16x4"].includes(type)) outputCount = 4;
	else if (["DEMUX16"].includes(type)) outputCount = 16;

	return { inputCount, outputCount };
};
