export type PinType = "input" | "output";

export type PinPosition = { x: number; y: number; type: PinType };

export type Connection = {
	from: { blockId: number; pin: string };
	to: { blockId: number; pin: string; inputIndex: number };
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
	| "NOR_8";

export type Block = {
	id: number;
	type: BlockType;
	x: number;
	y: number;
	inputs: number[];
	outputs: number[];
	state?: number;
	prevClock?: number;
};
