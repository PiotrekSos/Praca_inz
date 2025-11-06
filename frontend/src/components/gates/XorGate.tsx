import React from "react";

interface XorGateProps {
	inputs?: number[];
	outputs?: number[];
}

const XorGate: React.FC<XorGateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			<line
				x1="0"
				y1="20"
				x2="25"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="25"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			<path
				d="M15,10 Q45,30 15,50"
				fill="none"
				stroke="#1976d2"
				strokeWidth="2"
			/>
			<path
				d="M25,10 Q55,30 25,50 Q65,50 85,30 Q65,10 25,10 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			<line
				x1="85"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default XorGate;
