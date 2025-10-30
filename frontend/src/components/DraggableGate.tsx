import React, { useState } from "react";
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

type Props = {
	block: Block;
	onMove: (id: number, x: number, y: number, newOutput?: number) => void;
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

	const renderBlock = () => {
		switch (block.type) {
			case "BUFFER":
				return <BufferGate />;
			case "NOT":
				return <NotGate />;
			case "AND":
				return <AndGate />;
			case "OR":
				return <OrGate />;
			case "XOR":
				return <XorGate />;
			case "XNOR":
				return <XnorGate />;
			case "NOR":
				return <NorGate />;
			case "NAND":
				return <NandGate />;
			case "CLOCK":
				return <ClockInput value={block.outputs[0]} />;
			case "ONE":
				return <ConstOne />;
			case "ZERO":
				return <ConstZero />;
			case "TOGGLE":
				return (
					<ToggleSwitch
						value={block.outputs[0] === 1}
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
				return <DFlipFlop />;
			case "T_FLIPFLOP":
				return <TFlipFlop />;
			case "JK_FLIPFLOP":
				return <JKFlipFlop />;
			case "SR_FLIPFLOP":
				return <SRFlipFlop />;
			case "LAMP":
				return <LampOutput isOn={block.inputs?.[0] === 1} />;
			case "NAND_4":
				return <NandGate4 />;
			case "NAND_8":
				return <NandGate8 />;
			case "NOR_4":
				return <NorGate4 />;
			case "NOR_8":
				return <NorGate8 />;
			case "MUX16":
				return <Mux16 />;
			case "DEMUX16":
				return <Demux16 />;
			case "MUX4":
				return <Mux4 />;
			case "DEMUX4":
				return <Demux4 />;
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
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			style={{
				position: "absolute",
				left: block.x,
				top: block.y,
				cursor: "move",
				overflow: "visible",
				width:
					block.type === "NAND_8" || block.type === "NOR_8"
						? 160
						: block.type === "NAND_4" || block.type === "NOR_4"
						? 120
						: 100,
				height:
					block.type === "NAND_8" || block.type === "NOR_8"
						? 160
						: block.type === "NAND_4" || block.type === "NOR_4"
						? 100
						: 60,
			}}
		>
			{renderBlock()}

			{/* --- specjalne przypadki dla MUX / DEMUX --- */}
			{(() => {
				switch (block.type) {
					case "MUX4": {
						// 4 wejścia danych + 2 sterujące + 1 wyjście
						const dataInputs = block.inputs.slice(0, 4);
						const controlInputs = block.inputs.slice(4, 6);

						return (
							<>
								{/* wejścia danych po lewej */}
								{dataInputs.map((_, idx) => (
									<div
										key={`mux4-data-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
										style={{
											position: "absolute",
											left: -8,
											top: 20 + idx * 20,
											width: 14,
											height: 14,
											borderRadius: "50%",
											background: "#1976d2",
											cursor: "crosshair",
										}}
									/>
								))}

								{/* wejścia sterujące od dołu */}
								{controlInputs.map((_, idx) => (
									<div
										key={`mux4-ctrl-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												4 + idx
											);
										}}
										style={{
											position: "absolute",
											left: 30 + idx * 25,
											bottom: 58,
											width: 14,
											height: 14,
											borderRadius: "50%",
											background: "#1976d2",
											cursor: "crosshair",
										}}
									/>
								))}

								{/* wyjście */}
								<div
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output");
									}}
									style={{
										position: "absolute",
										right: -8,
										top: 45,
										width: 14,
										height: 14,
										borderRadius: "50%",
										background: "tomato",
										cursor: "crosshair",
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
								{/* 16 wejść danych po lewej */}
								{dataInputs.map((_, idx) => (
									<div
										key={`mux16-data-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
										style={{
											position: "absolute",
											left: 0,
											top: 17 + idx * 18.5,
											width: 10,
											height: 10,
											borderRadius: "50%",
											background: "#1976d2",
											cursor: "crosshair",
										}}
									/>
								))}

								{/* 4 wejścia sterujące na dole */}
								{controlInputs.map((_, idx) => (
									<div
										key={`mux16-ctrl-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												16 + idx
											);
										}}
										style={{
											position: "absolute",
											left: 20 + idx * 15,
											bottom: 60,
											width: 12,
											height: 12,
											borderRadius: "50%",
											background: "#1976d2",
											cursor: "crosshair",
										}}
									/>
								))}

								{/* pojedyncze wyjście */}
								<div
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "output");
									}}
									style={{
										position: "absolute",
										right: -8,
										top: 150,
										width: 14,
										height: 14,
										borderRadius: "50%",
										background: "tomato",
										cursor: "crosshair",
									}}
								/>
							</>
						);
					}

					case "DEMUX4": {
						// 1 wejście + 2 sterujące + 4 wyjścia
						const outputs = block.outputs;
						const controlInputs = block.inputs.slice(1, 3);

						return (
							<>
								{/* pojedyncze wejście po lewej */}
								<div
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 0);
									}}
									style={{
										position: "absolute",
										left: -8,
										top: 45,
										width: 14,
										height: 14,
										borderRadius: "50%",
										background: "#1976d2",
										cursor: "crosshair",
									}}
								/>

								{/* wejścia sterujące od dołu */}
								{controlInputs.map((_, idx) => (
									<div
										key={`demux4-ctrl-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												1 + idx
											);
										}}
										style={{
											position: "absolute",
											left: 25 + idx * 20,
											bottom: -8,
											width: 14,
											height: 14,
											borderRadius: "50%",
											background: "#1976d2",
											cursor: "crosshair",
										}}
									/>
								))}

								{/* 4 wyjścia po prawej */}
								{outputs.map((_, idx) => (
									<div
										key={`demux4-out-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output", idx);
										}}
										style={{
											position: "absolute",
											right: -8,
											top: 20 + idx * 15,
											width: 14,
											height: 14,
											borderRadius: "50%",
											background: "tomato",
											cursor: "crosshair",
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
								{/* pojedyncze wejście */}
								<div
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 0);
									}}
									style={{
										position: "absolute",
										left: -8,
										top: 150,
										width: 14,
										height: 14,
										borderRadius: "50%",
										background: "#1976d2",
										cursor: "crosshair",
									}}
								/>

								{/* sterujące */}
								{controlInputs.map((_, idx) => (
									<div
										key={`demux16-ctrl-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(
												block.id,
												"input",
												1 + idx
											);
										}}
										style={{
											position: "absolute",
											left: 20 + idx * 15,
											bottom: 60,
											width: 12,
											height: 12,
											borderRadius: "50%",
											background: "#1976d2",
											cursor: "crosshair",
										}}
									/>
								))}

								{/* 16 wyjść */}
								{outputs.map((_, idx) => (
									<div
										key={`demux16-out-${idx}`}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "output", idx);
										}}
										style={{
											position: "absolute",
											right: -8,
											top: 17 + idx * 18.5,
											width: 10,
											height: 10,
											borderRadius: "50%",
											background: "tomato",
											cursor: "crosshair",
										}}
									/>
								))}
							</>
						);
					}

					default: {
						// --- pozostałe typy jak dotychczas ---
						return (
							<>
								{hasInputPins &&
									block.inputs?.map((_, idx) => (
										<div
											key={idx}
											onMouseDown={(e) => {
												e.stopPropagation();
												onPinClick(
													block.id,
													"input",
													idx
												);
											}}
											style={{
												position: "absolute",
												left: -8,
												top: 18 + idx * 20,
												width: 14,
												height: 14,
												borderRadius: "50%",
												background: "#1976d2",
												cursor: "crosshair",
											}}
										/>
									))}

								{hasOutputPin && (
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
								)}
							</>
						);
					}
				}
			})()}
		</div>
	);
};

export default DraggableGate;
