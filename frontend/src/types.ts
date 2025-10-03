export type Block = { id: number; type: "NOR" | "NAND"; x: number; y: number };

export type PinType = "input" | "output";

export type PinPosition = { x: number; y: number; type: PinType };

export type Connection = {
	from: { blockId: number; pin: "output" };
	to: { blockId: number; pin: "input"; inputIndex: number };
};
