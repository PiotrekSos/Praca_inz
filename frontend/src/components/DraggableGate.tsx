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
				return (
					<ClockInput
						onChange={(newValue) => {
							block.output = newValue;
							onMove(block.id, block.x, block.y); // odświeża widok
						}}
					/>
				);
			case "ONE":
				return <ConstOne />;
			case "ZERO":
				return <ConstZero />;
			case "TOGGLE":
				return (
					<ToggleSwitch
						value={block.output === 1}
						onChange={(newValue) => {
							block.output = newValue ? 1 : 0;
							onMove(block.id, block.x, block.y);
						}}
					/>
				);
			case "LAMP":
				return <LampOutput isOn={block.inputs?.[0] === 1} />;
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
				width: 100,
				height: 60,
				cursor: "move",
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
		</div>
	);
};

export default DraggableGate;
