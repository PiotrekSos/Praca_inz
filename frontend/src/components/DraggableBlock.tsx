import React, { useState } from "react";
import { Block } from "../types";
import NorGate from "./gates/NorGate";
import NandGate from "./gates/NandGate";

type Props = {
	block: Block;
	onMove: (id: number, x: number, y: number) => void;
	onPinClick: (
		blockId: number,
		pin: "input" | "output",
		inputIndex?: number
	) => void;
};

const DraggableGate: React.FC<Props> = ({ block, onMove, onPinClick }) => {
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	const handleMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		setOffset({ x: e.clientX - block.x, y: e.clientY - block.y });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (dragging) {
			onMove(block.id, e.clientX - offset.x, e.clientY - offset.y);
		}
	};

	const handleMouseUp = () => setDragging(false);

	return (
		<div
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			style={{
				position: "absolute",
				left: block.x,
				top: block.y,
				width: 100,
				height: 60,
				cursor: "move",
			}}
		>
			{block.type === "NOR" && <NorGate />}
			{block.type === "NAND" && <NandGate />}

			{/* Input pins */}
			<div
				onMouseDown={(e) => {
					e.stopPropagation();
					onPinClick(block.id, "input", 0);
				}}
				style={{
					position: "absolute",
					left: -8,
					top: 18,
					width: 14,
					height: 14,
					borderRadius: "50%",
					background: "#1976d2",
					cursor: "crosshair",
				}}
			/>
			<div
				onMouseDown={(e) => {
					e.stopPropagation();
					onPinClick(block.id, "input", 1);
				}}
				style={{
					position: "absolute",
					left: -8,
					top: 38,
					width: 14,
					height: 14,
					borderRadius: "50%",
					background: "#1976d2",
					cursor: "crosshair",
				}}
			/>

			{/* Output pin */}
			<div
				onMouseDown={(e) => {
					e.stopPropagation();
					onPinClick(block.id, "output");
				}}
				style={{
					position: "absolute",
					right: -8,
					top: 28,
					width: 14,
					height: 14,
					borderRadius: "50%",
					background: "tomato",
					cursor: "crosshair",
				}}
			/>
		</div>
	);
};

export default DraggableGate;
