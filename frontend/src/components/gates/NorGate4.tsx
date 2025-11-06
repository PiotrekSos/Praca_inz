import React from "react";

interface NorGate4Props {
	inputs?: number[];
	outputs?: number[];
}

const NorGate4: React.FC<NorGate4Props> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="140" height="100">
			<line
				x1="0"
				y1="25"
				x2="35"
				y2="25"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="42"
				x2="48"
				y2="42"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="59"
				x2="48"
				y2="59"
				stroke={inputColors[2] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="76"
				x2="35"
				y2="76"
				stroke={inputColors[3] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Kształt NOR (przesunięty w lewo o ~10 px) */}
			<path
				d="M30,20 Q70,50 30,80 Q80,80 100,50 Q80,20 30,20 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="105"
				cy="50"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="110"
				y1="50"
				x2="120"
				y2="50"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NorGate4;
