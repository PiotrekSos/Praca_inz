import React from "react";

interface FlipFlopProps {
	inputs?: number[];
	outputs?: number[];
}

const SRFlipFlop: React.FC<FlipFlopProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColors = outputs.map((v) => (v === 1 ? "green" : "#1976d2"));

	return (
		<svg width="120" height="100">
			{/* Linie wejściowe */}
			<line
				x1="10"
				y1="35"
				x2="30"
				y2="35"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="10"
				y1="50"
				x2="30"
				y2="50"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="10"
				y1="65"
				x2="30"
				y2="65"
				stroke={inputColors[2] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Prostokąt */}
			<rect
				x="30"
				y="20"
				width="60"
				height="60"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
				rx="6"
			/>

			{/* Etykieta główna */}
			<text
				x="60"
				y="55"
				fontSize="16"
				fontWeight="bold"
				fill="#1976d2"
				textAnchor="middle"
			>
				SR
			</text>

			{/* Etykiety wejść */}
			<text x="35" y="35" fontSize="12" fill="#1976d2">
				S
			</text>
			<text x="35" y="50" fontSize="12" fill="#1976d2">
				R
			</text>
			<text x="35" y="65" fontSize="10" fill="#555">
				CLK
			</text>

			{/* Linie wyjściowe */}
			<line
				x1="90"
				y1="35"
				x2="110"
				y2="35"
				stroke={outputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="90"
				y1="65"
				x2="110"
				y2="65"
				stroke={outputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Etykiety wyjść */}
			<text x="78" y="35" fontSize="12" fill="#1976d2">
				Q
			</text>
			<text x="73" y="65" fontSize="12" fill="#1976d2">
				!Q
			</text>
		</svg>
	);
};

export default SRFlipFlop;
