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
import LabelBlock from "./blocks/LabelBlock";
import Ram16x4 from "./blocks/Ram16x4.tsx";

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
				return (
					<BufferGate
						key={`${block.id}-${block.outputs?.join(
							""
						)}-${block.inputs?.join("")}`}
						inputs={block.inputs}
						outputs={block.outputs}
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
					/>
				);
			case "AND":
				return (
					<AndGate inputs={block.inputs} outputs={block.outputs} />
				);
			case "OR":
				return <OrGate inputs={block.inputs} outputs={block.outputs} />;
			case "XOR":
				return (
					<XorGate inputs={block.inputs} outputs={block.outputs} />
				);
			case "XNOR":
				return (
					<XnorGate inputs={block.inputs} outputs={block.outputs} />
				);
			case "NOR":
				return (
					<NorGate inputs={block.inputs} outputs={block.outputs} />
				);
			case "NAND":
				return (
					<NandGate inputs={block.inputs} outputs={block.outputs} />
				);
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
				return (
					<DFlipFlop inputs={block.inputs} outputs={block.outputs} />
				);
			case "T_FLIPFLOP":
				return (
					<TFlipFlop inputs={block.inputs} outputs={block.outputs} />
				);
			case "JK_FLIPFLOP":
				return (
					<JKFlipFlop inputs={block.inputs} outputs={block.outputs} />
				);
			case "SR_FLIPFLOP":
				return (
					<SRFlipFlop inputs={block.inputs} outputs={block.outputs} />
				);
			case "LAMP":
				return <LampOutput isOn={block.inputs?.[0] === 1} />;
			case "NAND_4":
				return (
					<NandGate4 inputs={block.inputs} outputs={block.outputs} />
				);
			case "NAND_8":
				return (
					<NandGate8 inputs={block.inputs} outputs={block.outputs} />
				);
			case "NOR_4":
				return (
					<NorGate4 inputs={block.inputs} outputs={block.outputs} />
				);
			case "NOR_8":
				return (
					<NorGate8 inputs={block.inputs} outputs={block.outputs} />
				);
			case "MUX16":
				return <Mux16 inputs={block.inputs} outputs={block.outputs} />;
			case "DEMUX16":
				return (
					<Demux16 inputs={block.inputs} outputs={block.outputs} />
				);
			case "MUX4":
				return <Mux4 inputs={block.inputs} outputs={block.outputs} />;
			case "DEMUX4":
				return <Demux4 inputs={block.inputs} outputs={block.outputs} />;
			case "RAM_16x4":
				return (
					<Ram16x4 inputs={block.inputs} outputs={block.outputs} />
				);
			case "LABEL":
				return (
					<LabelBlock
						text={block.text}
						onChange={(newText) => {
							onMove(block.id, block.x, block.y);
							block.text = newText;
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
					block.type === "MUX16" || block.type === "DEMUX16"
						? 320
						: block.type === "NAND_8" || block.type === "NOR_8"
						? 160
						: block.type === "NAND_4" || block.type === "NOR_4"
						? 100
						: 60,
			}}
		>
			{renderBlock()}

			{/* --- specjalne przypadki --- */}
			{(() => {
				switch (block.type) {
					case "MUX4": {
						// 4 dane (0-3), 2 selektory (4-5), 1 !E (6)
						const dataInputs = block.inputs.slice(0, 4);
						const controlInputs = block.inputs.slice(4, 6);
						// const enableInput = block.inputs[6];

						return (
							<>
								{/* wejścia danych po lewej */}
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
								{/* wejścia sterujące od góry */}
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
								{/* !E na dole */}
								<div
									key="mux4-en"
									className="pin input"
									style={{ left: 53, top: 103 }} // 100(h) - 7
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 6);
									}}
								/>
								{/* wyjście */}
								<div
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
						// const enableInput = block.inputs[20];

						return (
							<>
								{/* 16 wejść danych po lewej */}
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
								{/* 4 wejścia sterujące na górze */}
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
								{/* !E na dole */}
								<div
									key="mux16-en"
									className="pin input"
									style={{ left: 53, top: 333 }} // 330(h) - 7
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 20);
									}}
								/>
								{/* pojedyncze wyjście */}
								<div
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
						// const enableInput = block.inputs[3];

						return (
							<>
								<div
									className="pin input"
									style={{ left: -7, top: 43 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 0);
									}}
								/>
								{/* wejścia sterujące od góry */}
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
								{/* !E na dole */}
								<div
									key="demux4-en"
									className="pin input"
									style={{ left: 53, top: 103 }} // 100(h) - 7
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
						// const enableInput = block.inputs[5];

						return (
							<>
								<div
									className="pin input"
									style={{ left: -7, top: 158 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 0);
									}}
								/>
								{/* sterujące na górze */}
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
								{/* !E na dole */}
								<div
									key="demux16-en"
									className="pin input"
									style={{ left: 53, top: 333 }} // 330(h) - 7
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
						const ctrlInputs = block.inputs.slice(8, 10);
						const outputs = block.outputs;

						return (
							<>
								{/* Wejścia Danych (D0-D3) */}
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

								{/* Wejścia Adresowe (A0-A3) */}
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

								{/* Wejścia Sterujące (CS - góra, WE - dół) */}
								<div // CS
									key="ram-cs"
									className="pin input"
									style={{ left: 63, top: -7 }}
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 8);
									}}
								/>
								<div // WE
									key="ram-we"
									className="pin input"
									style={{ left: 63, top: 173 }} // 180 (wysokość) - 7
									onMouseDown={(e) => {
										e.stopPropagation();
										onPinClick(block.id, "input", 9);
									}}
								/>

								{/* Wyjścia Danych (Q0-Q3) */}
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
						// Definicja pinów synchronicznych (D, T, J, K, CLK)
						const syncInputs =
							block.type === "D_FLIPFLOP" ||
							block.type === "T_FLIPFLOP"
								? block.inputs.slice(0, 2) // D, CLK lub T, CLK
								: block.inputs.slice(0, 3); // J, K, CLK lub S, R, CLK

						// Definicja pinów asynchronicznych (S, R)
						const asyncStartIndex = syncInputs.length;
						const asyncInputs = block.inputs.slice(asyncStartIndex); // S, R

						return (
							<>
								{/* --- Wejścia synchroniczne (po lewej) --- */}
								{syncInputs.map((_, idx) => (
									<div
										key={`ff-in-${idx}`}
										className="pin input"
										style={{
											left: 4,
											top: 28 + idx * 15,
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}

								{/* --- Wejścia asynchroniczne (S na górze, R na dole) --- */}
								{asyncInputs.length > 0 && (
									<div // S (Set)
										key={`ff-in-s`}
										className="pin input"
										style={{ left: 53, top: -2 }} // Na środku, na górze
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
									<div // R (Reset)
										key={`ff-in-r`}
										className="pin input"
										style={{
											left: 53,
											bottom:
												block.type === "JK_FLIPFLOP"
													? -40
													: -20,
										}} // Na środku, na dole
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

								{/* --- Wyjścia (Q i !Q) --- */}
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
								{/* --- wejścia --- */}
								{block.inputs?.map((_, idx) => (
									<div
										key={`in-${idx}`}
										className="pin input"
										style={{
											left: -7,
											top: idx === 0 ? 13 : 33, // dwie linie wejściowe w połowie wysokości
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}

								{/* --- wyjście --- */}
								<div
									className="pin output"
									style={{
										right: -8,
										top: 23, // środkowo, pasuje do linii wyjścia SVG
									}}
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
										style={{
											left: -7,
											top: 23, // dwie linie wejściowe w połowie wysokości
										}}
										onMouseDown={(e) => {
											e.stopPropagation();
											onPinClick(block.id, "input", idx);
										}}
									/>
								))}

								{/* --- wyjście --- */}
								<div
									className="pin output"
									style={{
										right: -8,
										top: 23, // środkowo, pasuje do linii wyjścia SVG
									}}
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
										style={{
											right: -7,
											top: 43,
										}}
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
										style={{
											right: -7,
											top: 73,
										}}
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
										style={{
											right: -8,
											top: 23,
										}}
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
        .pin {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          cursor: crosshair;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .pin.input {
          background: #1976d2;
        }
        .pin.output {
          background: tomato;
        }
        div:hover > .pin {
          opacity: 1;
        }
      `}
			</style>
		</div>
	);
};
export default DraggableGate;
