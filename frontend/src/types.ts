export type PinType = "input" | "output";

export type PinPosition = { x: number; y: number; type: PinType };

export type Connection = {
	from: {
		blockId: number;
		pin: "output";
		outputIndex: number;
	};
	to: {
		blockId: number;
		pin: "input";
		inputIndex: number;
	};
	points?: { x: number; y: number }[];
};

export type BlockType =
	| "BUFFER"
	| "NOT"
	| "AND"
	| "OR"
	| "XOR"
	| "XNOR"
	| "NAND"
	| "NOR"
	| "CLOCK"
	| "ONE"
	| "ZERO"
	| "TOGGLE"
	| "LAMP"
	| "D_FLIPFLOP"
	| "T_FLIPFLOP"
	| "JK_FLIPFLOP"
	| "SR_FLIPFLOP"
	| "NAND_4"
	| "NAND_8"
	| "NOR_4"
	| "NOR_8"
	| "MUX4"
	| "DEMUX4"
	| "MUX16"
	| "DEMUX16"
	| "LABEL"
	| "RAM_16x4";

export type Block = {
	id: number;
	type: BlockType;
	x: number;
	y: number;
	inputs: number[];
	outputs: number[];
	state?: number;
	prevClock?: number;
	text?: string;
	memory?: Uint8Array;
	label?: string;
	size?: { width: number; height: number };
};

export interface JsonBlock extends Omit<Block, "memory"> {
	memory?: Record<string, number>;
}
export interface SaveData {
	version: string;
	blocks: JsonBlock[];
	connections: Connection[];
	viewport?: { x: number; y: number; scale: number };
}

export type Selection =
	| { type: "block"; id: number }
	| { type: "connection"; index: number }
	| null;
