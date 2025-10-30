import AndGate from "./gates/AndGate";
import OrGate from "./gates/OrGate";
import NotGate from "./gates/NotGate";
import BufferGate from "./gates/BufferGate";
import XorGate from "./gates/XorGate";
import XnorGate from "./gates/XnorGate";
import NandGate from "./gates/NandGate";
import NorGate from "./gates/NorGate";
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

const gates = [
	{ type: "CLOCK", component: <ClockInput />, label: "CLOCK" },
	{ type: "ONE", component: <ConstOne />, label: "1" },
	{ type: "ZERO", component: <ConstZero />, label: "0" },
	{ type: "TOGGLE", component: <ToggleSwitch />, label: "TOGGLE" },

	{ type: "BUFFER", component: <BufferGate />, label: "BUF" },
	{ type: "NOT", component: <NotGate />, label: "NOT" },
	{ type: "AND", component: <AndGate />, label: "AND" },
	{ type: "OR", component: <OrGate />, label: "OR" },
	{ type: "XOR", component: <XorGate />, label: "XOR" },
	{ type: "XNOR", component: <XnorGate />, label: "XNOR" },
	{ type: "NAND", component: <NandGate />, label: "NAND" },
	{ type: "NOR", component: <NorGate />, label: "NOR" },

	{ type: "LAMP", component: <LampOutput />, label: "LAMP" },

	{ type: "D_FLIPFLOP", component: <DFlipFlop />, label: "D FF" },
	{ type: "T_FLIPFLOP", component: <TFlipFlop />, label: "T FF" },
	{ type: "JK_FLIPFLOP", component: <JKFlipFlop />, label: "JK FF" },
	{ type: "SR_FLIPFLOP", component: <SRFlipFlop />, label: "SR FF" },
	{ type: "NAND_4", component: <NandGate4 />, label: "4-input NAND" },
	{ type: "NAND_8", component: <NandGate8 />, label: "8-input NAND" },
	{ type: "NOR_4", component: <NorGate4 />, label: "4-input NOR" },
	{ type: "NOR_8", component: <NorGate8 />, label: "8-input NOR" },
];

const Toolbar = ({ onAddGate }: { onAddGate: (type: string) => void }) => {
	return (
		<div
			style={{
				gap: "12px",
				flexWrap: "wrap",
				padding: 8,
			}}
		>
			{gates.map(({ type, component, label }) => (
				<div
					key={type}
					onClick={() => onAddGate(type)}
					style={{
						border: "1px solid #aaa",
						borderRadius: 8,
						padding: 8,
						textAlign: "center",
						cursor: "pointer",
						width: 110,
						background: "#f8f8f8",
						boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
					}}
				>
					<div
						style={{
							height: 40,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{component}
					</div>
					<div style={{ fontSize: 12, marginTop: 4 }}>{label}</div>
				</div>
			))}
		</div>
	);
};

export default Toolbar;
