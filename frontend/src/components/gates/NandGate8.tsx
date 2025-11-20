import React from "react";

interface NandGate8Props {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean; // <-- Nowy prop
}

const NandGate8: React.FC<NandGate8Props> = ({
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
			{Array.from({ length: 8 }, (_, i) => (
				<line
					key={i}
					x1="0"
					y1={28 + i * 15}
					x2="25"
					y2={28 + i * 15}
					stroke={getColor(inputs[i])}
					strokeWidth="3"
				/>
			))}

			{/* Kształt NAND */}
			<path
				d="M25,20 H65 A40,40 0 0,1 65,140 H25 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Bańka negacji */}
			<circle
				cx="130"
				cy="80"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="135"
				y1="80"
				x2="160"
				y2="80"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NandGate8;
