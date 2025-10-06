export type PinType = "input" | "output";

export type PinPosition = { x: number; y: number; type: PinType };

export type Connection = {
	from: { blockId: number; pin: "output" };
	to: { blockId: number; pin: "input"; inputIndex: number };
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
	| "LAMP";

export type Block = {
	id: number;
	type: BlockType;
	x: number;
	y: number;
};
