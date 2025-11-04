import { useState, useEffect } from "react";
import Toolbox from "./components/Toolbox";
import DraggableGate from "./components/DraggableGate";
import type { Block, Connection, BlockType } from "./types.ts";
import { getInputPinPosition, getOutputPinPosition } from "./pinPositions";

const evaluateCircuit = (blocks: Block[], connections: Connection[]) => {
	const newBlocks = blocks.map((b) => ({ ...b, inputs: [...b.inputs] }));

	for (const b of newBlocks) {
		switch (b.type) {
			case "ONE":
				b.outputs[0] = 1;
				break;
			case "ZERO":
				b.outputs[0] = 0;
				break;
			default:
				break;
		}
	}

	for (const b of newBlocks) {
		b.inputs = b.inputs.map(() => 0);
	}

	for (const c of connections) {
		const from = newBlocks.find((b) => b.id === c.from.blockId);
		const to = newBlocks.find((b) => b.id === c.to.blockId);
		if (!from || !to) continue;
		if (to.inputs[c.to.inputIndex] !== undefined) {
			to.inputs[c.to.inputIndex] = from.outputs[c.from.outputIndex || 0];
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
				const [D, CLK] = b.inputs;
				if (!("state" in b)) b.state = 0;
				if (CLK === 1) b.state = D;
				b.outputs[0] = Number(b.state);
				b.outputs[1] = Number(!b.state);
				break;
			}
			case "T_FLIPFLOP": {
				const [T, CLK] = b.inputs;
				if (!("state" in b)) b.state = 0;
				if (CLK === 1 && T === 1) b.state = b.state ? 0 : 1;
				b.outputs[0] = Number(b.state);
				b.outputs[1] = Number(!b.state);
				break;
			}
			case "JK_FLIPFLOP": {
				const [J, K, CLK] = b.inputs;
				if (!("state" in b)) b.state = 0;
				if (CLK === 1) {
					if (J === 0 && K === 0) {
						// No change
					} else if (J === 0 && K === 1) b.state = 0;
					else if (J === 1 && K === 0) b.state = 1;
					else if (J === 1 && K === 1) b.state = b.state ? 0 : 1;
				}
				b.outputs[0] = Number(b.state);
				b.outputs[1] = Number(!b.state);
				break;
			}
			case "SR_FLIPFLOP": {
				const [S, R, CLK] = b.inputs;
				if (!("state" in b)) b.state = 0;
				if (CLK === 1) {
					if (S === 1 && R === 0) b.state = 1;
					else if (S === 0 && R === 1) b.state = 0;
				}
				b.outputs[0] = Number(b.state);
				b.outputs[1] = Number(!b.state);
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

			case "MUX4": {
				const dataInputs = b.inputs.slice(0, 4);
				const selectBits = b.inputs.slice(4, 6);
				const sel = (selectBits[0] << 1) | selectBits[1];
				b.outputs[0] = dataInputs[sel] ?? 0;
				break;
			}
			case "MUX16": {
				const dataInputs = b.inputs.slice(0, 16);
				const selectBits = b.inputs.slice(16, 20);
				const sel =
					(selectBits[0] << 3) |
					(selectBits[1] << 2) |
					(selectBits[2] << 1) |
					selectBits[3];
				b.outputs[0] = dataInputs[sel] ?? 0;
				break;
			}
			case "DEMUX4": {
				const IN = b.inputs[0];
				const selectBits = b.inputs.slice(1, 3);
				const sel = (selectBits[0] << 1) | selectBits[1];
				b.outputs = [0, 0, 0, 0];
				if (IN === 1) b.outputs[sel] = 1;
				break;
			}
			case "DEMUX16": {
				const IN = b.inputs[0];
				const selectBits = b.inputs.slice(1, 5);
				const sel =
					(selectBits[0] << 3) |
					(selectBits[1] << 2) |
					(selectBits[2] << 1) |
					selectBits[3];
				b.outputs = new Array(16).fill(0);
				if (IN === 1) b.outputs[sel] = 1;
				break;
			}
			case "TOGGLE":
			case "CLOCK":
			case "ONE":
			case "ZERO":
			default:
				break;
		}
	}

	return newBlocks;
};

function App() {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [connections, setConnections] = useState<Connection[]>([]);
	const [pending, setPending] = useState<{
		from: { blockId: number; outputIndex?: number } | null;
	}>({ from: null });

	const handleAddBlock = (type: BlockType) => {
		const inputCount = ["NOT", "BUFFER", "LAMP"].includes(type)
			? 1
			: ["CLOCK", "ONE", "ZERO", "TOGGLE"].includes(type)
			? 0
			: ["JK_FLIPFLOP", "SR_FLIPFLOP", "DEMUX4"].includes(type)
			? 3
			: ["NAND_4", "NOR_4"].includes(type)
			? 4
			: ["DEMUX16"].includes(type)
			? 5
			: ["MUX4"].includes(type)
			? 6
			: ["NAND_8", "NOR_8"].includes(type)
			? 8
			: ["MUX16"].includes(type)
			? 20
			: ["LABEL"].includes(type)
			? 0
			: 2;

		const outputCount = [
			"JK_FLIPFLOP",
			"SR_FLIPFLOP",
			"D_FLIPFLOP",
			"T_FLIPFLOP",
		].includes(type)
			? 2
			: ["LAMP", "LABEL"].includes(type)
			? 0
			: ["DEMUX4"].includes(type)
			? 4
			: ["DEMUX16"].includes(type)
			? 16
			: 1;

		const newBlock: Block = {
			id: blocks.length,
			type,
			x: 200 + blocks.length * 40,
			y: 100 + blocks.length * 40,
			inputs: new Array(inputCount).fill(0),
			outputs: new Array(outputCount).fill(0),
		};

		setBlocks((prev) => evaluateCircuit([...prev, newBlock], connections));
	};

	const handleMove = (
		id: number,
		x: number,
		y: number,
		newOutput?: number
	) => {
		setBlocks((prev) => {
			const updated = prev.map((b) => {
				if (b.id === id) {
					const updatedBlock = { ...b, x, y };
					if (newOutput !== undefined) {
						updatedBlock.outputs[0] = newOutput;
					}
					return updatedBlock;
				}
				return b;
			});
			return evaluateCircuit(updated, connections);
		});
	};

	const handlePinClick = (
		blockId: number,
		pin: "input" | "output",
		index?: number
	) => {
		if (pin === "output" && !pending.from) {
			setPending({ from: { blockId, outputIndex: index ?? 0 } });
		} else if (pin === "input" && pending.from) {
			const newConnections = [
				...connections,
				{
					from: {
						blockId: pending.from.blockId,
						pin: "output",
						outputIndex: pending.from.outputIndex ?? 0,
					},
					to: {
						blockId,
						pin: "input",
						inputIndex: index ?? 0,
					},
				},
			];
			setConnections(newConnections);
			setBlocks((prev) => evaluateCircuit(prev, newConnections));
			setPending({ from: null });
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setBlocks((prev) => {
				const updated = prev.map((b) =>
					b.type === "CLOCK"
						? { ...b, outputs: [b.outputs[0] === 1 ? 0 : 1, 0] }
						: b
				);
				return evaluateCircuit(updated, connections);
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [connections]);

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Toolbox onAddGate={handleAddBlock} />
			<div
				style={{
					flex: 1,
					position: "relative",
					background: "#f0f0f0",
				}}
			>
				<svg
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: "100%",
						height: "100%",
						pointerEvents: "none",
					}}
				>
					{connections.map((c, i) => {
						const fromBlock = blocks.find(
							(b) => b.id === c.from.blockId
						);
						const toBlock = blocks.find(
							(b) => b.id === c.to.blockId
						);
						if (!fromBlock || !toBlock) return null;

						const from = getOutputPinPosition(
							fromBlock,
							c.from.outputIndex ?? 0
						);
						const to = getInputPinPosition(
							toBlock,
							c.to.inputIndex
						);

						const isHigh =
							fromBlock.outputs[c.from.outputIndex ?? 0] === 1;

						return (
							<line
								key={i}
								x1={from.x}
								y1={from.y}
								x2={to.x}
								y2={to.y}
								stroke={isHigh ? "green" : "#1976d2"}
								strokeWidth={3}
							/>
						);
					})}
				</svg>

				{blocks.map((b) => (
					<DraggableGate
						key={b.id}
						block={b}
						onMove={handleMove}
						onPinClick={handlePinClick}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
