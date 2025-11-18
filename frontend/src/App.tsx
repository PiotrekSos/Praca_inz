import { useState, useEffect, useRef } from "react";
import Toolbox from "./components/Toolbox";
import DraggableGate from "./components/DraggableGate";
import type { Block, Connection, BlockType } from "./types.ts";
import { getInputPinPosition, getOutputPinPosition } from "./pinPositions";

// --- TYP DLA ZAZNACZENIA ---
type Selection =
	| { type: "block"; id: number }
	| { type: "connection"; index: number }
	| null;

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
			case "D_FLIPFLOP":
			case "T_FLIPFLOP":
			case "JK_FLIPFLOP":
			case "SR_FLIPFLOP": {
				if (!("state" in b)) b.state = 0;
				b.outputs[0] = Number(b.state);
				b.outputs[1] = Number(!b.state);
				break;
			}
			default:
				break;
		}
	}

	for (let i = 0; i < newBlocks.length; i++) {
		for (const b of newBlocks) {
			if (!["ONE", "ZERO", "TOGGLE", "CLOCK"].includes(b.type)) {
				b.inputs = b.inputs.map(() => 0);
			}
		}

		for (const c of connections) {
			const from = newBlocks.find((b) => b.id === c.from.blockId);
			const to = newBlocks.find((b) => b.id === c.to.blockId);
			if (!from || !to) continue;
			if (to.inputs[c.to.inputIndex] !== undefined) {
				to.inputs[c.to.inputIndex] =
					from.outputs[c.from.outputIndex || 0];
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
					const [D, CLK, S_low, R_low] = b.inputs;
					if (!("state" in b)) b.state = 0;
					if (R_low === 0) b.state = 0;
					else if (S_low === 0) b.state = 1;
					else if (CLK === 1) b.state = D;
					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					break;
				}
				case "T_FLIPFLOP": {
					const [T, CLK, S_low, R_low] = b.inputs;
					if (!("state" in b)) b.state = 0;
					if (R_low === 0) b.state = 0;
					else if (S_low === 0) b.state = 1;
					else if (CLK === 1 && T === 1) b.state = b.state ? 0 : 1;
					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					break;
				}
				case "JK_FLIPFLOP": {
					const [J, K, CLK, S_low, R_low] = b.inputs;
					if (!("state" in b)) b.state = 0;
					if (R_low === 0) b.state = 0;
					else if (S_low === 0) b.state = 1;
					else if (CLK === 1) {
						if (J === 0 && K === 1) b.state = 0;
						else if (J === 1 && K === 0) b.state = 1;
						else if (J === 1 && K === 1) b.state = b.state ? 0 : 1;
					}
					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					break;
				}
				case "SR_FLIPFLOP": {
					const [S, R, CLK] = b.inputs;
					if (S === 1 && R === 0) b.state = 1;
					else if (S === 0 && R === 1) b.state = 0;
					b.outputs[0] = Number(b.state);
					b.outputs[1] = Number(!b.state);
					break;
				}
				case "RAM_16x4": {
					const dataIn = b.inputs.slice(0, 4);
					const addressIn = b.inputs.slice(4, 8);
					const CS_low = b.inputs[8] ?? 1;
					const WE_low = b.inputs[9] ?? 1;

					if (!b.memory) b.memory = new Uint8Array(16);

					let address = 0;
					if (addressIn[0] === 1) address |= 1;
					if (addressIn[1] === 1) address |= 2;
					if (addressIn[2] === 1) address |= 4;
					if (addressIn[3] === 1) address |= 8;

					if (CS_low === 0 && WE_low === 0) {
						let dataNibble = 0;
						if (dataIn[0] === 1) dataNibble |= 1;
						if (dataIn[1] === 1) dataNibble |= 2;
						if (dataIn[2] === 1) dataNibble |= 4;
						if (dataIn[3] === 1) dataNibble |= 8;
						b.memory[address] = dataNibble;
						b.outputs.fill(1);
					} else if (CS_low === 0 && WE_low === 1) {
						const dataNibble = b.memory[address];
						b.outputs[0] = (dataNibble >> 0) & 1 ? 0 : 1;
						b.outputs[1] = (dataNibble >> 1) & 1 ? 0 : 1;
						b.outputs[2] = (dataNibble >> 2) & 1 ? 0 : 1;
						b.outputs[3] = (dataNibble >> 3) & 1 ? 0 : 1;
					} else {
						b.outputs.fill(1);
					}
					break;
				}
				case "MUX4": {
					const dataInputs = b.inputs.slice(0, 4);
					const selectBits = b.inputs.slice(4, 6);
					const E_low = b.inputs[6] ?? 1;
					if (E_low === 0) {
						const sel = (selectBits[0] << 1) | selectBits[1];
						const selectedValue = dataInputs[sel] ?? 0;
						b.outputs[0] = selectedValue === 1 ? 0 : 1;
					} else {
						b.outputs[0] = 1;
					}
					break;
				}
				case "MUX16": {
					const dataInputs = b.inputs.slice(0, 16);
					const selectBits = b.inputs.slice(16, 20);
					const E_low = b.inputs[20] ?? 1;
					if (E_low === 0) {
						const sel =
							(selectBits[0] << 3) |
							(selectBits[1] << 2) |
							(selectBits[2] << 1) |
							selectBits[3];
						const selectedValue = dataInputs[sel] ?? 0;
						b.outputs[0] = selectedValue === 1 ? 0 : 1;
					} else {
						b.outputs[0] = 1;
					}
					break;
				}
				case "DEMUX4": {
					const IN = b.inputs[0];
					const selectBits = b.inputs.slice(1, 3);
					const E_low = b.inputs[3] ?? 1;
					b.outputs = [1, 1, 1, 1];
					if (E_low === 0) {
						const sel = (selectBits[0] << 1) | selectBits[1];
						b.outputs[sel] = IN === 1 ? 0 : 1;
					}
					break;
				}
				case "DEMUX16": {
					const IN = b.inputs[0];
					const selectBits = b.inputs.slice(1, 5);
					const E_low = b.inputs[5] ?? 1;
					b.outputs = new Array(16).fill(1);
					if (E_low === 0) {
						const sel =
							(selectBits[0] << 3) |
							(selectBits[1] << 2) |
							(selectBits[2] << 1) |
							selectBits[3];
						b.outputs[sel] = IN === 1 ? 0 : 1;
					}
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
			}
		}
	}
	return newBlocks;
};

function EditableWire({
	connection,
	from,
	to,
	isHigh,
	onChange,
	isSelected,
	onSelect,
}: {
	connection: Connection & { points?: { x: number; y: number }[] };
	from: { x: number; y: number };
	to: { x: number; y: number };
	isHigh: boolean;
	onChange: (newPoints: { x: number; y: number }[]) => void;
	isSelected: boolean;
	onSelect: () => void;
}) {
	const fromRef = useRef(from);
	const toRef = useRef(to);
	const onChangeRef = useRef(onChange);

	useEffect(() => {
		fromRef.current = from;
		toRef.current = to;
		onChangeRef.current = onChange;
	}, [from, to, onChange]);

	const generateDefaultPoints = (f, t) => [
		{ x: Math.round((f.x + t.x) / 2), y: f.y },
		{ x: Math.round((f.x + t.x) / 2), y: t.y },
	];

	const [localPoints, setLocalPoints] = useState(
		connection.points?.length
			? connection.points.slice()
			: generateDefaultPoints(from, to)
	);
	const pointsRef = useRef(localPoints.slice());
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		const pts = pointsRef.current.slice();
		if (!pts.length) return;
		const f = fromRef.current;
		const t = toRef.current;

		if (pts.length >= 1) {
			const first = pts[0];
			const verticalFirst =
				Math.abs(first.x - f.x) < Math.abs(first.y - f.y);
			if (verticalFirst) {
				first.x = f.x;
				if (pts.length >= 2) pts[1].y = first.y;
			} else {
				first.y = f.y;
				if (pts.length >= 2) pts[1].x = first.x;
			}
		}

		if (pts.length >= 1) {
			const lastIdx = pts.length - 1;
			const last = pts[lastIdx];
			const verticalLast =
				Math.abs(t.x - last.x) < Math.abs(t.y - last.y);
			if (verticalLast) {
				last.x = t.x;
				if (pts.length >= 2) pts[lastIdx - 1].y = last.y;
			} else {
				last.y = t.y;
				if (pts.length >= 2) pts[lastIdx - 1].x = last.x;
			}
		}

		pointsRef.current = pts;
		setLocalPoints(pts.slice());
		onChangeRef.current(pts.slice());
	}, [from.x, from.y, to.x, to.y]);

	const mergeCollinearPoints = (pts: { x: number; y: number }[]) => {
		if (pts.length < 2) return pts;
		const full = [fromRef.current, ...pts, toRef.current];
		const simplified = [full[0]];
		for (let i = 1; i < full.length - 1; i++) {
			const prev = simplified[simplified.length - 1];
			const curr = full[i];
			const next = full[i + 1];
			if (
				(prev.x === curr.x && curr.x === next.x) ||
				(prev.y === curr.y && curr.y === next.y)
			)
				continue;
			else simplified.push(curr);
		}
		simplified.push(full[full.length - 1]);
		return simplified.slice(1, -1);
	};

	const getFull = () => [
		fromRef.current,
		...pointsRef.current,
		toRef.current,
	];

	const computeMidpoints = () => {
		const full = getFull();
		const mids = [];
		for (let i = 0; i < full.length - 1; i++) {
			const a = full[i];
			const b = full[i + 1];
			mids.push({
				x: (a.x + b.x) / 2,
				y: (a.y + b.y) / 2,
				segmentIndex: i,
				isVertical: Math.abs(a.x - b.x) < Math.abs(a.y - b.y),
			});
		}
		return mids;
	};

	const insertPointAtSegment = (segIdx) => {
		const pts = pointsRef.current.slice();
		const full = [fromRef.current, ...pts, toRef.current];
		const a = full[segIdx];
		const b = full[segIdx + 1];
		const newPt = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
		if (a.x === b.x) newPt.x = a.x;
		else if (a.y === b.y) newPt.y = a.y;
		pts.splice(segIdx, 0, newPt);
		const merged = mergeCollinearPoints(pts);
		pointsRef.current = merged;
		setLocalPoints(merged.slice());
		onChange(merged.slice());
	};

	const getMovedPoint = (p, isVertical, dx, dy) =>
		isVertical ? { x: p.x + dx, y: p.y } : { x: p.x, y: p.y + dy };

	const handleMidMouseDown = (m) => (e) => {
		e.stopPropagation();
		const startClientX = e.clientX;
		const startClientY = e.clientY;
		const startPts = pointsRef.current.map((p) => ({ ...p }));
		const seg = m.segmentIndex;

		const push = (pts) => {
			const merged = mergeCollinearPoints(pts);
			pointsRef.current = merged;
			setLocalPoints(merged.slice());
			onChange(merged.slice());
		};

		const move = (ev) => {
			const dx = ev.clientX - startClientX;
			const dy = ev.clientY - startClientY;
			let newPts = startPts.map((p) => ({ ...p }));

			if (seg === 0) {
				const from = fromRef.current;
				const first =
					newPts.length > 0
						? newPts[0]
						: generateDefaultPoints(from, toRef.current)[0];
				const moved = getMovedPoint(first, m.isVertical, dx, dy);
				const vertical =
					Math.abs(from.x - moved.x) < Math.abs(from.y - moved.y);
				const corner = vertical
					? { x: moved.x, y: from.y }
					: { x: from.x, y: moved.y };
				newPts = [corner, moved, ...newPts.slice(1)];
			} else if (seg > 0 && seg < startPts.length) {
				const p_start_idx = seg - 1;
				const p_end_idx = seg;
				newPts[p_start_idx] = getMovedPoint(
					startPts[p_start_idx],
					m.isVertical,
					dx,
					dy
				);
				newPts[p_end_idx] = getMovedPoint(
					startPts[p_end_idx],
					m.isVertical,
					dx,
					dy
				);
			} else if (seg === startPts.length) {
				const to = toRef.current;
				const last = newPts[newPts.length - 1];
				const moved = getMovedPoint(last, m.isVertical, dx, dy);
				const vertical =
					Math.abs(to.x - moved.x) < Math.abs(to.y - moved.y);
				const corner = vertical
					? { x: moved.x, y: to.y }
					: { x: to.x, y: moved.y };
				newPts = [...newPts.slice(0, -1), moved, corner];
			}
			if (newPts.length >= 2) {
				const first = newPts[0];
				const second = newPts[1];
				if (first.x !== second.x && first.y !== second.y)
					newPts[1] = { x: first.x, y: second.y };
				const last = newPts[newPts.length - 1];
				const prev = newPts[newPts.length - 2];
				if (last.x !== prev.x && last.y !== prev.y)
					newPts[newPts.length - 2] = { x: prev.x, y: last.y };
			}
			push(newPts);
		};

		const up = () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
	};

	const full = [fromRef.current, ...localPoints, toRef.current];
	const pathData = full
		.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
		.join(" ");
	const midpoints = computeMidpoints();

	const strokeColor = isSelected ? "#0800e4ff" : isHigh ? "green" : "#1976d2";
	const strokeWidth = isSelected ? 6 : 3;

	return (
		<g
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* HITBOX (Przezroczysta linia) - Tutaj dodajemy obsługę kliknięcia/zaznaczania */}
			<path
				d={pathData}
				stroke="transparent"
				strokeWidth={20}
				fill="none"
				style={{ cursor: "pointer", pointerEvents: "stroke" }}
				// Używamy onMouseDown, aby działało szybko i pewnie, tak samo jak bloki
				onMouseDown={(e) => {
					e.stopPropagation();
					onSelect();
				}}
				// Zachowujemy onClick do dodawania punktów, jeśli chcesz (opcjonalne)
				onClick={(e) => {
					e.stopPropagation();
					const svg = e.currentTarget.closest("svg");
					if (!svg) return;
					const CTM = svg.getScreenCTM();
					if (!CTM) return;
					const pt = svg.createSVGPoint();
					pt.x = e.clientX;
					pt.y = e.clientY;
					const svgPoint = pt.matrixTransform(CTM.inverse());
					const cx = svgPoint.x;
					const cy = svgPoint.y;

					let best = Infinity;
					let idx = -1;
					for (let i = 0; i < midpoints.length; i++) {
						const d = Math.hypot(
							midpoints[i].x - cx,
							midpoints[i].y - cy
						);
						if (d < best) {
							best = d;
							idx = i;
						}
					}
					if (idx >= 0 && best < 40) insertPointAtSegment(idx);
				}}
			/>

			{/* WIDOCZNA LINIA - tylko do wyświetlania */}
			<path
				d={pathData}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
				fill="none"
				style={{ pointerEvents: "none", transition: "stroke 0.2s" }}
			/>

			{isHovered &&
				midpoints.map((m, i) => (
					<circle
						key={i}
						cx={m.x}
						cy={m.y}
						r={6}
						fill="orange"
						stroke="#333"
						style={{
							cursor: m.isVertical ? "ew-resize" : "ns-resize",
							pointerEvents: "all",
						}}
						onMouseDown={handleMidMouseDown(m)}
					/>
				))}
		</g>
	);
}

function App() {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [connections, setConnections] = useState<Connection[]>([]);
	const [selection, setSelection] = useState<Selection>(null);
	const [pending, setPending] = useState<{
		from: { blockId: number; outputIndex?: number } | null;
	}>({ from: null });

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.key === "Delete" || e.key === "Backspace") && selection) {
				if (selection.type === "block") {
					const blockId = selection.id;
					const newBlocks = blocks.filter((b) => b.id !== blockId);
					const newConnections = connections.filter(
						(c) =>
							c.from.blockId !== blockId &&
							c.to.blockId !== blockId
					);
					setBlocks(evaluateCircuit(newBlocks, newConnections));
					setConnections(newConnections);
					setSelection(null);
				} else if (selection.type === "connection") {
					const connIndex = selection.index;
					const newConnections = connections.filter(
						(_, index) => index !== connIndex
					);
					setBlocks((prev) => evaluateCircuit(prev, newConnections));
					setConnections(newConnections);
					setSelection(null);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selection, blocks, connections]);

	const handleAddBlock = (type: BlockType) => {
		const inputCount = ["NOT", "BUFFER", "LAMP"].includes(type)
			? 1
			: ["CLOCK", "ONE", "ZERO", "TOGGLE"].includes(type)
			? 0
			: ["SR_FLIPFLOP"].includes(type)
			? 3
			: [
					"NAND_4",
					"NOR_4",
					"D_FLIPFLOP",
					"T_FLIPFLOP",
					"DEMUX4",
			  ].includes(type)
			? 4
			: ["JK_FLIPFLOP"].includes(type)
			? 5
			: ["DEMUX16"].includes(type)
			? 6
			: ["MUX4"].includes(type)
			? 7
			: ["NAND_8", "NOR_8"].includes(type)
			? 8
			: ["MUX16"].includes(type)
			? 21
			: ["LABEL"].includes(type)
			? 0
			: ["RAM_16x4"].includes(type)
			? 10
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
			: ["DEMUX4", "RAM_16x4"].includes(type)
			? 4
			: ["DEMUX16"].includes(type)
			? 16
			: 1;

		const newBlock: Block = {
			id: Math.max(0, ...blocks.map((b) => b.id)) + 1,
			type,
			x: 200 + (blocks.length % 10) * 40,
			y: 100 + (blocks.length % 10) * 40,
			inputs: new Array(inputCount).fill(0),
			outputs: new Array(outputCount).fill(0),
			...(type === "RAM_16x4" && { memory: new Uint8Array(16) }),
		};
		setBlocks((prev) => evaluateCircuit([...prev, newBlock], connections));
	};

	const handleMove = (
		id: number,
		x: number,
		y: number,
		newOutput?: number
	) => {
		setBlocks((prevBlocks) => {
			let updated = prevBlocks.map((b) => {
				if (
					b.id === id &&
					b.type === "TOGGLE" &&
					newOutput !== undefined
				) {
					return { ...b, outputs: [newOutput] };
				}
				if (b.id === id) {
					return { ...b, x, y };
				}
				return b;
			});
			const isToggle = prevBlocks.find(
				(b) => b.id === id && b.type === "TOGGLE"
			);
			if (isToggle) updated = evaluateCircuit(updated, connections);
			return updated;
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
			if (pending.from.blockId === blockId) return;
			const newConnections = [
				...connections,
				{
					from: {
						blockId: pending.from.blockId,
						pin: "output",
						outputIndex: pending.from.outputIndex ?? 0,
					},
					to: { blockId, pin: "input", inputIndex: index ?? 0 },
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
				style={{ flex: 1, position: "relative", background: "#f0f0f0" }}
				// Usunięto onMouseDown stąd, bo SVG i tak je blokowało
			>
				<svg
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: "100%",
						height: "100%",
						pointerEvents: "all",
					}}
					// DODANO TUTAJ: Czyszczenie zaznaczenia przy kliknięciu w tło SVG
					onMouseDown={(e) => {
						// Sprawdzamy czy kliknięto bezpośrednio w SVG, a nie w kabel
						if (e.target === e.currentTarget) {
							setSelection(null);
						}
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

						const isSelected =
							selection?.type === "connection" &&
							selection.index === i;

						return (
							<EditableWire
								key={i}
								connection={c}
								from={from}
								to={to}
								isHigh={isHigh}
								isSelected={isSelected}
								onSelect={() =>
									setSelection({
										type: "connection",
										index: i,
									})
								}
								onChange={(newPoints) => {
									setConnections((prev) =>
										prev.map((conn, idx) =>
											idx === i
												? { ...conn, points: newPoints }
												: conn
										)
									);
								}}
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
						isSelected={
							selection?.type === "block" && selection.id === b.id
						}
						onSelect={() =>
							setSelection({ type: "block", id: b.id })
						}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
