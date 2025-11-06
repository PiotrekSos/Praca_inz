import React from "react";

interface XnorGateProps {
	inputs?: number[];
	outputs?: number[];
}

const XnorGate: React.FC<XnorGateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			<line
				x1="0"
				y1="20"
				x2="15"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="15"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			<path
				d="M5,10 Q35,30 5,50"
				fill="none"
				stroke="#1976d2"
				strokeWidth="2"
			/>
			<path
				d="M15,10 Q45,30 15,50 Q55,50 78,30 Q55,10 15,10 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>
			<circle
				cx="83"
				cy="30"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			<line
				x1="88"
				y1="30"
				x2="108"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default XnorGate;
