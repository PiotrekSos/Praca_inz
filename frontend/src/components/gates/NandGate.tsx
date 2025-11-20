import React from "react";

interface NandGateProps {
	inputs?: number[]; // mogą być undefined
	outputs?: number[];
	showColors?: boolean; // <-- Nowy prop
}

const NandGate: React.FC<NandGateProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="100" height="60">
			{/* --- linie wejściowe (POZYCJE NIENARUSZONE) --- */}
			<line
				x1="0"
				y1="20"
				x2="20"
				y2="20"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="20"
				y2="40"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>

			{/* --- kształt bramki AND (baza dla NAND) --- */}
			<path
				d="M 20 6 H 56 A 24 24 0 0 1 56 54 H 20 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* --- kółeczko negacji --- */}
			<circle
				cx="85"
				cy="30"
				r="5"
				stroke={bodyColor}
				strokeWidth="2"
				fill="white"
			/>

			{/* --- linia wyjściowa --- */}
			<line
				x1="90"
				y1="30"
				x2="100"
				y2="30"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NandGate;
