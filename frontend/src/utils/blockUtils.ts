import type { BlockType } from "../types";

export const getBlockDimensions = (type: BlockType) => {
	if (type === "RAM_16x4") return { w: 140, h: 200 };
	if (type === "MUX16" || type === "DEMUX16") return { w: 100, h: 320 };
	if (type === "NAND_8" || type === "NOR_8") return { w: 160, h: 160 };
	if (type === "NAND_4" || type === "NOR_4") return { w: 120, h: 100 };
	return { w: 100, h: 60 };
};
