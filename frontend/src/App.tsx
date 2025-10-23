import { useState, useEffect } from "react";
import Toolbox from "./components/Toolbox";
import DraggableGate from "./components/DraggableGate";
import type { Block, Connection, BlockType } from "./types.ts";

const evaluateCircuit = (blocks: Block[], connections: Connection[]) => {
	const newBlocks = blocks.map((b) => ({ ...b, inputs: [...b.inputs] }));

	for (const b of newBlocks) {
		switch (b.type) {
			case "ONE":
				b.output = 1;
				break;
			case "ZERO":
				b.output = 0;
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
			to.inputs[c.to.inputIndex] = from.output;
		}
	}

	for (const b of newBlocks) {
		switch (b.type) {
			case "AND":
				b.output = b.inputs.every((v) => v === 1) ? 1 : 0;
				break;
			case "OR":
				b.output = b.inputs.some((v) => v === 1) ? 1 : 0;
				break;
			case "NOT":
				b.output = b.inputs[0] ? 0 : 1;
				break;
			case "NAND":
				b.output = b.inputs.every((v) => v === 1) ? 0 : 1;
				break;
			case "NOR":
				b.output = b.inputs.some((v) => v === 1) ? 0 : 1;
				break;
			case "XOR":
				b.output = b.inputs.reduce((a, b) => a ^ b, 0);
				break;
			case "XNOR":
				b.output = b.inputs.reduce((a, b) => a ^ b, 0) ? 0 : 1;
				break;
			case "BUFFER":
				b.output = b.inputs[0] || 0;
				break;
			case "TOGGLE":
			case "CLOCK":
			case "ONE":
			case "ZERO":
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
			: 2;

		const newBlock: Block = {
			id: blocks.length,
			type,
			x: 200 + blocks.length * 40,
			y: 100 + blocks.length * 40,
			inputs: new Array(inputCount).fill(0),
			output: 0,
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
						updatedBlock.output = newOutput;
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

	const getOutputPos = (block: Block) => ({
		x: block.x + 100,
		y: block.y + 30,
	});
	const getInputPos = (block: Block, idx: number) => ({
		x: block.x,
		y: block.y + 20 + idx * 20,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setBlocks((prev) => {
				const updated = prev.map((b) =>
					b.type === "CLOCK"
						? { ...b, output: b.output === 1 ? 0 : 1 }
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

						const isHigh = fromBlock.output === 1;
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
