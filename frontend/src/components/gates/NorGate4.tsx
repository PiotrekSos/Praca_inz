import React from "react";

interface NorGate4Props {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean; // <-- Nowy prop
}

const NorGate4: React.FC<NorGate4Props> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="140" height="100">
			{/* Linie wejściowe */}
			<line
				x1="0"
				y1="25"
				x2="35"
				y2="25"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="42"
				x2="48"
				y2="42"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="59"
				x2="48"
				y2="59"
				stroke={getColor(inputs[2])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="76"
				x2="35"
				y2="76"
				stroke={getColor(inputs[3])}
				strokeWidth="3"
			/>

			{/* Kształt NOR (przesunięty w lewo o ~10 px) */}
			<path
				d="M30,20 Q70,50 30,80 Q80,80 100,50 Q80,20 30,20 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="105"
				cy="50"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="110"
				y1="50"
				x2="120"
				y2="50"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NorGate4;
