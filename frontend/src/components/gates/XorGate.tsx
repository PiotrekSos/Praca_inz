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
			{/* --- linie wejściowe --- */}
			{/* Krótsze, bo dotykają pierwszej krzywej (shield) */}
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

			{/* --- Dodatkowa krzywa wejściowa (Shield) --- */}
			{/* Przesunięta w lewo względem korpusu (x=10 zamiast 20) */}
			<path
				d="M 10 6 Q 34 30 10 54"
				fill="none"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- kształt bramki OR (Korpus) --- */}
			<path
				d="M 20 6 H 38 A 48 48 0 0 1 80 30 A 48 48 0 0 1 38 54 H 20 Q 44 30 20 6 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- linia wyjściowa --- */}
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

export default XorGate;
