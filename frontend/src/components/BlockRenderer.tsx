import React from "react";
import type { Block } from "../types";

// Importy wszystkich bramek...
import BufferGate from "./gates/BufferGate";
import NotGate from "./gates/NotGate";
// ... (Wklej tutaj wszystkie importy bramek z DraggableGate)
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
import DFlipFlop from "./gates/DFlipFlop";
import TFlipFlop from "./gates/TFlipFlop";
import JKFlipFlop from "./gates/JKFlipFlop";
import SRFlipFlop from "./gates/SRFlipFlop";
import NorGate4 from "./gates/NorGate4";
import NorGate8 from "./gates/NorGate8";
import NandGate4 from "./gates/NandGate4";
import NandGate8 from "./gates/NandGate8";
import Mux16 from "./gates/Mux16";
import Demux16 from "./gates/Demux16";
import Mux4 from "./gates/Mux4";
import Demux4 from "./gates/Demux4";
import LabelBlock from "./blocks/LabelBlock";
import Ram16x4 from "./blocks/Ram16x4";

interface BlockRendererProps {
	block: Block;
	showColors: boolean;
	isSimulationRunning: boolean;
	onMove: (id: number, x: number, y: number, newOutput?: number) => void;
	onLabelChange?: (id: number, text: string) => void;
	onResize?: (id: number, width: number, height: number) => void;
	isSelected?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
	block,
	showColors,
	isSimulationRunning,
	onMove,
	onLabelChange,
	onResize,
	isSelected,
}) => {
	switch (block.type) {
		case "BUFFER":
			return (
				<BufferGate
					key={block.id}
					inputs={block.inputs}
					outputs={block.outputs}
					showColors={showColors}
				/>
			);
		case "NOT":
			return (
				<NotGate
					key={block.id}
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
				<ClockInput value={block.outputs[0]} showColors={showColors} />
			);
		case "ONE":
			return <ConstOne showColors={showColors} />;
		case "ZERO":
			return <ConstZero showColors={showColors} />;
		case "TOGGLE":
			return (
				<ToggleSwitch
					value={block.outputs[0] === 1}
					showColors={showColors}
					onChange={(newValue) =>
						onMove(block.id, block.x, block.y, newValue ? 1 : 0)
					}
				/>
			);
		case "LAMP":
			return (
				<LampOutput
					isOn={isSimulationRunning && block.inputs?.[0] === 1}
					showColors={showColors}
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
					width={block.size?.width ?? 100}
					height={block.size?.height ?? 40}
					onChange={(newLabel) => onLabelChange?.(block.id, newLabel)}
					onResize={(w, h) => onResize?.(block.id, w, h)}
					isSelected={isSelected}
				/>
			);
		default:
			return null;
	}
};
