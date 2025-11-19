import React from "react";

interface AndGateProps {
	inputs?: number[]; // mogą być undefined
	outputs?: number[];
}

const AndGate: React.FC<AndGateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			{/* --- linie wejściowe (POZYCJE NIENARUSZONE) --- */}
			<line
				x1="0"
				y1="20"
				x2="20"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="20"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			<path
				d="M 20 6 H 56 A 24 24 0 0 1 56 54 H 20 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- linia wyjściowa (POZYCJA NIENARUSZONA) --- */}
			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default AndGate;
