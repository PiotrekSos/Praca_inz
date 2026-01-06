import React, { useState, useEffect, useRef } from "react";
import type { Block } from "../types.ts";
import { BlockRenderer } from "./BlockRenderer";
import { getBlockPinLayout } from "../utils/pinLayouts";
import { getBlockDimensions } from "../utils/blockUtils";

type Props = {
	block: Block;
	isSelected: boolean;
	onSelect: () => void;
	onMove: (id: number, x: number, y: number, newOutput?: number) => void;
	onLabelChange?: (id: number, newLabel: string) => void;
	onResize?: (id: number, width: number, height: number) => void;
	onPinClick: (
		blockId: number,
		pin: "input" | "output",
		inputIndex?: number
	) => void;
	scale: number;
	isSimulationRunning: boolean;
	showColors: boolean;
};

const DraggableGate: React.FC<Props> = ({
	block,
	onMove,
	onLabelChange,
	onResize,
	onPinClick,
	isSelected,
	onSelect,
	scale,
	isSimulationRunning,
	showColors,
}) => {
	const [dragging, setDragging] = useState(false);
	const dragStartRef = useRef({ mouseX: 0, mouseY: 0, blockX: 0, blockY: 0 });

	const { w: defaultW, h: defaultH } = getBlockDimensions(block.type);
	const finalWidth = block.size?.width ?? defaultW;
	const finalHeight = block.size?.height ?? defaultH;

	const handleMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		onSelect();
		setDragging(true);
		dragStartRef.current = {
			mouseX: e.clientX,
			mouseY: e.clientY,
			blockX: block.x,
			blockY: block.y,
		};
	};

	useEffect(() => {
		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (!dragging) return;
			const dx = e.clientX - dragStartRef.current.mouseX;
			const dy = e.clientY - dragStartRef.current.mouseY;
			const newX = dragStartRef.current.blockX + dx / scale;
			const newY = dragStartRef.current.blockY + dy / scale;
			onMove(block.id, newX, newY);
		};

		const handleGlobalMouseUp = () => {
			setDragging(false);
		};

		if (dragging) {
			window.addEventListener("mousemove", handleGlobalMouseMove);
			window.addEventListener("mouseup", handleGlobalMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", handleGlobalMouseMove);
			window.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, [dragging, block.id, onMove, scale]);

	const pins = getBlockPinLayout(block);

	return (
		<div
			onMouseDown={handleMouseDown}
			style={{
				position: "absolute",
				left: block.x,
				top: block.y,
				cursor: dragging ? "grabbing" : "move",
				overflow: "visible",
				boxShadow: isSelected
					? "0 0 0 2px #1976d2, 0 0 10px rgba(25, 118, 210, 0.5)"
					: "none",
				zIndex: isSelected ? 1000 : 1,
				borderRadius: "4px",
				width: finalWidth,
				height: finalHeight,
			}}
		>
			<BlockRenderer
				block={block}
				showColors={showColors}
				isSimulationRunning={isSimulationRunning}
				onMove={onMove}
				onLabelChange={onLabelChange}
				onResize={onResize}
				isSelected={isSelected}
			/>

			{pins.map((pin) => (
				<div
					key={`${pin.type}-${pin.index}`}
					className={`pin ${pin.type}`}
					style={pin.style}
					onMouseDown={(e) => {
						e.stopPropagation();
						onPinClick(block.id, pin.type, pin.index);
					}}
				/>
			))}

			<style>
				{`
        .pin { position: absolute; width: 14px; height: 14px; border-radius: 50%; cursor: crosshair; opacity: 0; transition: opacity 0.15s ease; }
        .pin.input { background: #1976d2; }
        .pin.output { background: tomato; }
        div:hover > .pin { opacity: 1; }

		.monochrome .pin.input,
                    .monochrome .pin.output {
                        background: black !important;
                    }

		.monochrome rect,
                    .monochrome path,
                    .monochrome line,
                    .monochrome circle,
                    .monochrome polygon {
                        stroke: black !important;
                    }		
						
		.monochrome svg text {
                        fill: black !important;
                        stroke: none !important;
                    }
		
		.monochrome div {
                        border-color: black !important;
                        color: black !important;
                    }			
					
      `}
			</style>
		</div>
	);
};
export default DraggableGate;
