import React from "react";

interface NorGate8Props {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean; // <-- Nowy prop
}

const NorGate8: React.FC<NorGate8Props> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="160" height="160">
			{/* Linie wejściowe */}
			<line
				x1="0"
				y1="28"
				x2="41"
				y2="28"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="43"
				x2="50"
				y2="43"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="58"
				x2="56"
				y2="58"
				stroke={getColor(inputs[2])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="73"
				x2="59"
				y2="73"
				stroke={getColor(inputs[3])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="88"
				x2="59"
				y2="88"
				stroke={getColor(inputs[4])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="103"
				x2="56"
				y2="103"
				stroke={getColor(inputs[5])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="118"
				x2="50"
				y2="118"
				stroke={getColor(inputs[6])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="133"
				x2="41"
				y2="133"
				stroke={getColor(inputs[7])}
				strokeWidth="3"
			/>

			{/* Kształt NOR (lekko przesunięty w lewo) */}
			<path
				d="M35,20 Q85,80 35,140 Q110,140 130,80 Q110,20 35,20 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="135"
				cy="80"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Wyjście */}
			<line
				x1="140"
				y1="80"
				x2="160"
				y2="80"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NorGate8;
