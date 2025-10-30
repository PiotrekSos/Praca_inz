import { useState, useEffect } from "react";
import Toolbox from "./components/Toolbox";
import DraggableGate from "./components/DraggableGate";
import type { Block, Connection, BlockType } from "./types.ts";

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
			to.inputs[c.to.inputIndex] = from.outputs[0];
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
					if (J === 0 && K === 0) b.state = b.state;
					else if (J === 0 && K === 1) b.state = 0;
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
			case "TOGGLE":
			case "CLOCK":
			case "ONE":
			case "ZERO":
			case "NAND_4": {
				b.outputs[0] = b.inputs.every((v) => v === 1) ? 0 : 1;
				break;
			}
			case "NAND_8": {
				b.outputs[0] = b.inputs.every((v) => v === 1) ? 0 : 1;
				break;
			}
			case "NOR_4": {
				b.outputs[0] = b.inputs.some((v) => v === 1) ? 0 : 1;
				break;
			}
			case "NOR_8": {
				b.outputs[0] = b.inputs.some((v) => v === 1) ? 0 : 1;
				break;
			}
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
		from: { blockId: number } | null;
	}>({ from: null });

	const handleAddBlock = (type: BlockType) => {
		const inputCount = ["NOT", "BUFFER", "LAMP"].includes(type)
			? 1
			: ["CLOCK", "ONE", "ZERO", "TOGGLE"].includes(type)
			? 0
			: ["JK_FLIPFLOP", "SR_FLIPFLOP"].includes(type)
			? 3
			: ["NAND_4", "NOR_4"].includes(type)
			? 4
			: ["NAND_8", "NOR_8"].includes(type)
			? 8
			: 2;

		const outputCount = [
			"JK_FLIPFLOP",
			"SR_FLIPFLOP",
			"D_FLIPFLOP",
			"T_FLIPFLOP",
		].includes(type)
			? 2
			: ["LAMP"].includes(type)
			? 0
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
		inputIndex?: number
	) => {
		if (pin === "output" && !pending.from) {
			setPending({ from: { blockId } });
		} else if (pin === "input" && pending.from) {
			const newConnections = [
				...connections,
				{
					from: { blockId: pending.from.blockId, pin: "output" },
					to: {
						blockId,
						pin: "input",
						inputIndex: inputIndex ?? 0,
					},
				},
			];
			setConnections(newConnections);
			setBlocks((prev) => evaluateCircuit(prev, newConnections));
			setPending({ from: null });
		}
	};

	const getOutputPos = (block: Block) => {
		let xOffset = 100;
		let yOffset = 30;

		switch (block.type) {
			case "NAND_4":
			case "NOR_4":
				xOffset = 120;
				yOffset = 40;
				break;
			case "NAND_8":
			case "NOR_8":
				xOffset = 140;
				yOffset = 50;
				break;
		}

		console.log(
			"OutputPos",
			block.type,
			block.x + xOffset,
			block.y + yOffset
		);

		return {
			x: block.x + xOffset,
			y: block.y + yOffset,
		};
	};

	const getInputPos = (block: Block, idx: number) => ({
		x: block.x,
		y: block.y + 20 + idx * 20,
	});

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
				{/* Linie */}
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
						const from = getOutputPos(fromBlock);
						const to = getInputPos(toBlock, c.to.inputIndex);

						const isHigh = fromBlock.outputs[0] === 1;
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

				{/* Bramki */}
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
