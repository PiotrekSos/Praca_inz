import React from "react";

interface NandGate4Props {
	inputs?: number[];
	outputs?: number[];
}

const NandGate4: React.FC<NandGate4Props> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="140" height="100">
			{/* Linie wejściowe */}
			{[0, 1, 2, 3].map((i) => (
				<line
					key={i}
					x1="0"
					y1={25 + i * 17}
					x2="30"
					y2={25 + i * 17}
					stroke={inputColors[i] || "#1976d2"}
					strokeWidth="3"
				/>
			))}

			{/* Kształt bramki NAND */}
			<path
				d="M20,15 H60 A30,30 0 0,1 60,85 H20 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="100"
				cy="50"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="105"
				y1="50"
				x2="120"
				y2="50"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NandGate4;
