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

			{hasInputPins &&
				block.inputs?.map((_, idx) => (
					<div
						key={idx}
						onMouseDown={(e) => {
							e.stopPropagation();
							onPinClick(block.id, "input", idx);
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

			{hasOutputPin &&
				(() => {
					let right = -8;
					let top = 28;

					switch (block.type) {
						case "NAND_4":
						case "NOR_4":
							right = -40;
							top = 43;
							break;
						case "NAND_8":
						case "NOR_8":
							right = -10;
							top = 83;
							break;
						default:
							break;
					}

					return (
						<div
							onMouseDown={(e) => {
								e.stopPropagation();
								onPinClick(block.id, "output");
								onPinClick(block.id, "output");
							}}
							style={{
								position: "absolute",
								right,
								top,
								width: 14,
								height: 14,
								borderRadius: "50%",
								background: "tomato",
								cursor: "crosshair",
							}}
						/>
					);
				})()}
		</div>
	);
};

export default DraggableGate;
