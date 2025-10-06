export type PinType = "input" | "output";

export type PinPosition = { x: number; y: number; type: PinType };

export type Connection = {
	from: { blockId: number; pin: "output" };
	to: { blockId: number; pin: "input"; inputIndex: number };
};

export type GateType =
	| "BUFFER"
	| "NOT"
	| "AND"
	| "OR"
	| "XOR"
	| "XNOR"
	| "NAND"
	| "NOR";

export type Block = {
	id: number;
	type: GateType;
	x: number;
	y: number;
};
