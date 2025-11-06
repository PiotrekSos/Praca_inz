import React from "react";

interface OrGateProps {
	inputs?: number[];
	outputs?: number[];
}

const OrGate: React.FC<OrGateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			<line
				x1="0"
				y1="20"
				x2="30"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="30"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			<path
				d="M20,10 Q50,30 20,50 Q60,50 80,30 Q60,10 20,10 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

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

export default OrGate;
