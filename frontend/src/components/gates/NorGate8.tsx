import React from "react";

interface NorGate8Props {
	inputs?: number[];
	outputs?: number[];
}

const NorGate8: React.FC<NorGate8Props> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="160" height="160">
			{/* Linie wejściowe */}
			<line
				x1="0"
				y1="28"
				x2="41"
				y2="28"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="43"
				x2="50"
				y2="43"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="58"
				x2="56"
				y2="58"
				stroke={inputColors[2] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="73"
				x2="59"
				y2="73"
				stroke={inputColors[3] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="88"
				x2="59"
				y2="88"
				stroke={inputColors[4] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="103"
				x2="56"
				y2="103"
				stroke={inputColors[5] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="118"
				x2="50"
				y2="118"
				stroke={inputColors[6] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="133"
				x2="41"
				y2="133"
				stroke={inputColors[7] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Kształt NOR (lekko przesunięty w lewo) */}
			<path
				d="M35,20 Q85,80 35,140 Q110,140 130,80 Q110,20 35,20 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="135"
				cy="80"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Wyjście */}
			<line
				x1="140"
				y1="80"
				x2="160"
				y2="80"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NorGate8;
