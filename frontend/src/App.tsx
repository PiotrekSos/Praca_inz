import { useState } from "react";
import Toolbox from "./components/Toolbox";
import DraggableGate from "./components/DraggableGate";
import type { Block, Connection } from "./types.ts";

function App() {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [connections, setConnections] = useState<Connection[]>([]);
	const [pending, setPending] = useState<{
		from: { blockId: number } | null;
	}>({ from: null });

	const handleAddBlock = (type: "NOR" | "NAND") => {
		const newBlock: Block = {
			id: blocks.length,
			type,
			x: 200 + blocks.length * 40,
			y: 100 + blocks.length * 40,
		};
		setBlocks((prev) => [...prev, newBlock]);
	};

	const handleMove = (id: number, x: number, y: number) => {
		setBlocks((prev) =>
			prev.map((b) => (b.id === id ? { ...b, x, y } : b))
		);
	};

	const handlePinClick = (
		blockId: number,
		pin: "input" | "output",
		inputIndex?: number
	) => {
		if (pin === "output" && !pending.from) {
			setPending({ from: { blockId } });
		} else if (pin === "input" && pending.from) {
			setConnections((prev) => [
				...prev,
				{
					from: { blockId: pending.from.blockId, pin: "output" },
					to: { blockId, pin: "input", inputIndex: inputIndex ?? 0 },
				},
			]);
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

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Toolbox onAddGate={handleAddBlock} />
			<div
				style={{ flex: 1, position: "relative", background: "#f0f0f0" }}
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
						return (
							<line
								key={i}
								x1={from.x}
								y1={from.y}
								x2={to.x}
								y2={to.y}
								stroke="#1976d2"
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
