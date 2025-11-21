import React, { useState, useEffect, useRef } from "react";
import type { Block } from "../types.ts";

import BufferGate from "./gates/BufferGate";
import NotGate from "./gates/NotGate";
import AndGate from "./gates/AndGate";
import OrGate from "./gates/OrGate";
import XorGate from "./gates/XorGate";
import XnorGate from "./gates/XnorGate";
import NorGate from "./gates/NorGate";
import NandGate from "./gates/NandGate";

import ClockInput from "./blocks/ClockInput";
import ConstOne from "./blocks/ConstOne";
import ConstZero from "./blocks/ConstZero";
import ToggleSwitch from "./blocks/ToggleSwitch";
import LampOutput from "./blocks/LampOutput";
import DFlipFlop from "./gates/DFlipFlop.tsx";
import TFlipFlop from "./gates/TFlipFlop.tsx";
import JKFlipFlop from "./gates/JKFlipFlop.tsx";
import SRFlipFlop from "./gates/SRFlipFlop.tsx";
import NorGate4 from "./gates/NorGate4.tsx";
import NorGate8 from "./gates/NorGate8.tsx";
import NandGate4 from "./gates/NandGate4.tsx";
import NandGate8 from "./gates/NandGate8.tsx";
import Mux16 from "./gates/Mux16.tsx";
import Demux16 from "./gates/Demux16.tsx";
import Mux4 from "./gates/Mux4.tsx";
import Demux4 from "./gates/Demux4.tsx";
import LabelBlock from "./blocks/LabelBlock";
import Ram16x4 from "./blocks/Ram16x4.tsx";

type Props = {
	block: Block;
	isSelected: boolean;
	onSelect: () => void;
	onMove: (id: number, x: number, y: number, newOutput?: number) => void;
	onLabelChange?: (id: number, newLabel: string) => void;
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
	onPinClick,
	isSelected,
	onSelect,
	scale,
	isSimulationRunning,
	showColors,
}) => {
	const [dragging, setDragging] = useState(false);
	const dragStartRef = useRef({ mouseX: 0, mouseY: 0, blockX: 0, blockY: 0 });

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

	const renderBlock = () => {
		switch (block.type) {
			case "BUFFER":
				return (
					<BufferGate
						key={`${block.id}-${block.outputs?.join(
							""
						)}-${block.inputs?.join("")}`}
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "NOT":
				return (
					<NotGate
						key={`${block.id}-${block.outputs?.join(
							""
						)}-${block.inputs?.join("")}`}
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "AND":
				return (
					<AndGate
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "OR":
				return (
					<OrGate
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "XOR":
				return (
					<XorGate
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "XNOR":
				return (
					<XnorGate
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "NOR":
				return (
					<NorGate
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "NAND":
				return (
					<NandGate
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "CLOCK":
				return (
					<ClockInput
						value={block.outputs[0]}
						showColors={showColors}
					/>
				);
			case "ONE":
				return <ConstOne showColors={showColors} />;
			case "ZERO":
				return <ConstZero showColors={showColors} />;
			case "TOGGLE":
				return (
					<ToggleSwitch
						value={block.outputs[0] === 1}
						showColors={showColors} // <--- DODAJ TO
						onChange={(newValue) => {
							onMove(
								block.id,
								block.x,
								block.y,
								newValue ? 1 : 0
							);
						}}
					/>
				);
			case "D_FLIPFLOP":
				return (
					<DFlipFlop
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "T_FLIPFLOP":
				return (
					<TFlipFlop
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "JK_FLIPFLOP":
				return (
					<JKFlipFlop
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "SR_FLIPFLOP":
				return (
					<SRFlipFlop
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "LAMP":
				return (
					<LampOutput
						isOn={isSimulationRunning && block.inputs?.[0] === 1}
						showColors={showColors}
					/>
				);
			case "NAND_4":
				return (
					<NandGate4
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "NAND_8":
				return (
					<NandGate8
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "NOR_4":
				return (
					<NorGate4
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "NOR_8":
				return (
					<NorGate8
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "MUX16":
				return (
					<Mux16
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "DEMUX16":
				return (
					<Demux16
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "MUX4":
				return (
					<Mux4
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "DEMUX4":
				return (
					<Demux4
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "RAM_16x4":
				return (
					<Ram16x4
						inputs={block.inputs}
						outputs={block.outputs}
						showColors={showColors}
					/>
				);
			case "LABEL":
				return (
					<LabelBlock
						text={block.label}
						onChange={(newText) => {
							if (onLabelChange) {
								onLabelChange(block.id, newText);
							}
						}}
					/>
				);
			default:
				return null;
		}
	};

	const hasInputPins = !["CLOCK", "ONE", "ZERO", "TOGGLE"].includes(
		block.type
	);
	const hasOutputPin = !["LAMP"].includes(block.type);

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
				width:
					block.type === "RAM_16x4"
						? 140
						: block.type === "NAND_8" || block.type === "NOR_8"
						? 160
						: block.type === "NAND_4" || block.type === "NOR_4"
						? 120
						: 100,
				height:
					block.type === "MUX16" || block.type === "DEMUX16"
						? 320
						: block.type === "RAM_16x4"
						? 200
						: block.type === "NAND_8" || block.type === "NOR_8"
						? 160
						: block.type === "NAND_4" || block.type === "NOR_4"
						? 100
						: 60,
			}}
		>
			{renderBlock()}

			{/* --- PINY --- */}
			{(() => {
				switch (block.type) {
					case "MUX4": {
						const dataInputs = block.inputs.slice(0, 4);
						const controlInputs = block.inputs.slice(4, 6);
						return (
							<>
								{dataInputs.map((_, idx) => (
									<div
										key={`mux4-data-${idx}`}
										className="pin input"
										style={{ left: -7, top: 18 + idx * 18 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}
								{controlInputs.map((_, idx) => (
									<div
										key={`mux4-ctrl-${idx}`}
										className="pin input"
										style={{ left: 43 + idx * 20, top: -7 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												4 + idx
											);
										}}
									/>
								))}
								<div
									key="mux4-en"
									className="pin input"
									style={{ left: 53, top: 103 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 6);
									}}
								/>
								{/* DODANO KEY PONIŻEJ: */}
								<div
									key="mux4-out"
									className="pin output"
									style={{ right: -26, top: 43 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output", 0);
									}}
								/>
							</>
						);
					}
					case "MUX16": {
						const dataInputs = block.inputs.slice(0, 16);
						const controlInputs = block.inputs.slice(16, 20);
						return (
							<>
								{dataInputs.map((_, idx) => (
									<div
										key={`mux16-data-${idx}`}
										className="pin input"
										style={{
											left: -7,
											top: 17 + idx * 18.5,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}
								{controlInputs.map((_, idx) => (
									<div
										key={`mux16-ctrl-${idx}`}
										className="pin input"
										style={{ left: 33 + idx * 15, top: -7 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												16 + idx
											);
										}}
									/>
								))}
								<div
									key="mux16-en"
									className="pin input"
									style={{ left: 53, top: 333 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 20);
									}}
								/>
								{/* DODANO KEY PONIŻEJ: */}
								<div
									key="mux16-out"
									className="pin output"
									style={{ right: -26, top: 158 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output", 0);
									}}
								/>
							</>
						);
					}
					case "DEMUX4": {
						const outputs = block.outputs;
						const controlInputs = block.inputs.slice(1, 3);
						return (
							<>
								{/* DODANO KEY PONIŻEJ: */}
								<div
									key="demux4-in"
									className="pin input"
									style={{ left: -7, top: 43 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 0);
									}}
								/>
								{controlInputs.map((_, idx) => (
									<div
										key={`demux4-ctrl-${idx}`}
										className="pin input"
										style={{ left: 43 + idx * 20, top: -7 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												1 + idx
											);
										}}
									/>
								))}
								<div
									key="demux4-en"
									className="pin input"
									style={{ left: 53, top: 103 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 3);
									}}
								/>
								{outputs.map((_, idx) => (
									<div
										key={`demux4-out-${idx}`}
										className="pin output"
										style={{
											right: -26,
											top: 18 + idx * 18,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output", idx);
										}}
									/>
								))}
							</>
						);
					}
					case "DEMUX16": {
						const outputs = block.outputs;
						const controlInputs = block.inputs.slice(1, 5);
						return (
							<>
								{/* DODANO KEY PONIŻEJ: */}
								<div
									key="demux16-in"
									className="pin input"
									style={{ left: -7, top: 158 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 0);
									}}
								/>
								{controlInputs.map((_, idx) => (
									<div
										key={`demux16-ctrl-${idx}`}
										className="pin input"
										style={{ left: 33 + idx * 15, top: -7 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												1 + idx
											);
										}}
									/>
								))}
								<div
									key="demux16-en"
									className="pin input"
									style={{ left: 53, top: 333 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 5);
									}}
								/>
								{outputs.map((_, idx) => (
									<div
										key={`demux16-out-${idx}`}
										className="pin output"
										style={{
											right: -26,
											top: 18 + idx * 18.5,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output", idx);
										}}
									/>
								))}
							</>
						);
					}
					case "RAM_16x4": {
						const dataInputs = block.inputs.slice(0, 4);
						const addrInputs = block.inputs.slice(4, 8);
						const outputs = block.outputs;
						return (
							<>
								{dataInputs.map((_, idx) => (
									<div
										key={`ram-data-${idx}`}
										className="pin input"
										style={{ left: -6, top: 23 + idx * 15 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}
								{addrInputs.map((_, idx) => (
									<div
										key={`ram-addr-${idx}`}
										className="pin input"
										style={{ left: -6, top: 93 + idx * 15 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												4 + idx
											);
										}}
									/>
								))}
								<div
									key="ram-cs"
									className="pin input"
									style={{ left: 63, top: -7 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 8);
									}}
								/>
								<div
									key="ram-we"
									className="pin input"
									style={{ left: 63, top: 173 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 9);
									}}
								/>
								{outputs.map((_, idx) => (
									<div
										key={`ram-out-${idx}`}
										className="pin output"
										style={{
											right: -47,
											top: 58 + idx * 15,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output", idx);
										}}
									/>
								))}
							</>
						);
					}
					case "LABEL":
						return null;
					case "D_FLIPFLOP":
					case "T_FLIPFLOP":
					case "JK_FLIPFLOP":
					case "SR_FLIPFLOP": {
						const syncInputs =
							block.type === "D_FLIPFLOP" ||
							block.type === "T_FLIPFLOP"
								? block.inputs.slice(0, 2)
								: block.inputs.slice(0, 3);
						const asyncStartIndex = syncInputs.length;
						const asyncInputs = block.inputs.slice(asyncStartIndex);
						return (
							<>
								{syncInputs.map((_, idx) => (
									<div
										key={`ff-in-${idx}`}
										className="pin input"
										style={{ left: 4, top: 28 + idx * 15 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}
								{asyncInputs.length > 0 && (
									<div
										key={`ff-in-s`}
										className="pin input"
										style={{ left: 53, top: -2 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												asyncStartIndex
											);
										}}
									/>
								)}
								{asyncInputs.length > 1 && (
									<div
										key={`ff-in-r`}
										className="pin input"
										style={{
											left: 53,
											bottom:
												block.type === "JK_FLIPFLOP"
													? -40
													: -20,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												asyncStartIndex + 1
											);
										}}
									/>
								)}
								<div
									className="pin output"
									style={{ right: -16, top: 28 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output", 0);
									}}
								/>
								<div
									className="pin output"
									style={{
										right: -16,
										top:
											block.type === "D_FLIPFLOP" ||
											block.type === "T_FLIPFLOP"
												? 43
												: 58,
									}}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output", 1);
									}}
								/>
							</>
						);
					}
					case "AND":
					case "OR":
					case "NAND":
					case "NOR":
					case "XOR":
					case "XNOR": {
						return (
							<>
								{block.inputs?.map((_, idx) => (
									<div
										key={`in-${idx}`}
										className="pin input"
										style={{
											left: -7,
											top: idx === 0 ? 13 : 33,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}
								<div
									className="pin output"
									style={{ right: -8, top: 23 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output");
									}}
								/>
							</>
						);
					}
					case "NOT":
					case "BUFFER": {
						return (
							<>
								{block.inputs?.map((_, idx) => (
									<div
										key={`in-${idx}`}
										className="pin input"
										style={{ left: -7, top: 23 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}
								<div
									className="pin output"
									style={{ right: -8, top: 23 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output");
									}}
								/>
							</>
						);
					}
					case "NAND_4":
					case "NOR_4": {
						return (
							<>
								{hasInputPins &&
									block.inputs?.map((_, idx) => (
										<div
											key={idx}
											className="pin input"
											style={{
												left: -7,
												top: 18 + idx * 17,
											}}
											onMouseDown={(e) => {
												e.stopPropagation();
												onPinClick(
													block.id,
													"input",
													idx
												);
											}}
										/>
									))}
								{hasOutputPin && (
									<div
										className="pin output"
										style={{ right: -7, top: 43 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output");
										}}
									/>
								)}
							</>
						);
					}
					case "NAND_8":
					case "NOR_8": {
						return (
							<>
								{hasInputPins &&
									block.inputs?.map((_, idx) => (
										<div
											key={idx}
											className="pin input"
											style={{
												left: -7,
												top: 21 + idx * 15,
											}}
											onMouseDown={(e) => {
												e.stopPropagation();
												onPinClick(
													block.id,
													"input",
													idx
												);
											}}
										/>
									))}
								{hasOutputPin && (
									<div
										className="pin output"
										style={{ right: -7, top: 73 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output");
										}}
									/>
								)}
							</>
						);
					}
					default: {
						return (
							<>
								{hasInputPins &&
									block.inputs?.map((_, idx) => (
										<div
											key={idx}
											className="pin input"
											style={{
												left: -8,
												top: 23 + idx * 20,
											}}
											onMouseDown={(e) => {
												e.stopPropagation();
												onPinClick(
													block.id,
													"input",
													idx
												);
											}}
										/>
									))}
								{hasOutputPin && (
									<div
										className="pin output"
										style={{ right: -8, top: 23 }}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output");
										}}
									/>
								)}
							</>
						);
					}
				}
			})()}

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
