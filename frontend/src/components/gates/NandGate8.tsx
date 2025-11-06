import React from "react";

interface NandGate8Props {
	inputs?: number[];
	outputs?: number[];
}

const NandGate8: React.FC<NandGate8Props> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="160" height="160">
			{/* Linie wejściowe */}
			{Array.from({ length: 8 }, (_, i) => (
				<line
					key={i}
					x1="0"
					y1={28 + i * 15}
					x2="25"
					y2={28 + i * 15}
					stroke={inputColors[i] || "#1976d2"}
					strokeWidth="3"
				/>
			))}

			{/* Kształt NAND */}
			<path
				d="M25,20 H65 A40,40 0 0,1 65,140 H25 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="130"
				cy="80"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="135"
				y1="80"
				x2="160"
				y2="80"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NandGate8;
