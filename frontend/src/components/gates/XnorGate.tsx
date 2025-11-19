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
			{/* --- linie wejściowe --- */}
			<line
				x1="0"
				y1="20"
				x2="18"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="18"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* --- Dodatkowa krzywa wejściowa --- */}
			<path
				d="M 10 6 Q 34 30 10 54"
				fill="none"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- kształt bramki OR --- */}
			<path
				d="M 20 6 H 38 A 48 48 0 0 1 80 30 A 48 48 0 0 1 38 54 H 20 Q 44 30 20 6 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- kółeczko negacji --- */}
			<circle
				cx="85"
				cy="30"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- linia wyjściowa --- */}
			<line
				x1="90"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default XnorGate;
