import React, { useState } from "react";

export type BlockProps = {
	id: number;
	x: number;
	y: number;
	onMove: (id: number, x: number, y: number) => void;
	onPinClick: (id: number) => void;
};

const DraggableBlock: React.FC<BlockProps> = ({
	id,
	x,
	y,
	onMove,
	onPinClick,
}) => {
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const handleMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		setOffset({ x: e.clientX - x, y: e.clientY - y });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (dragging) {
			onMove(id, e.clientX - offset.x, e.clientY - offset.y);
		}
	};

	const handleMouseUp = () => {
		setDragging(false);
	};

	return (
		<div
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: 100,
				height: 60,
				background: "#90caf9",
				border: "2px solid #1976d2",
				borderRadius: 8,
				cursor: "move",
				userSelect: "none",
			}}
		>
			{/* Pin */}
			<div
				onMouseDown={(e) => {
					e.stopPropagation();
					onPinClick(id);
				}}
				style={{
					position: "absolute",
					right: -10,
					top: "50%",
					transform: "translateY(-50%)",
					width: 16,
					height: 16,
					borderRadius: "50%",
					background: "#1976d2",
					cursor: "crosshair",
				}}
			/>
		</div>
	);
};

export default DraggableBlock;
