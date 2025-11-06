import React from "react";

interface GateProps {
	inputs?: number[];
	outputs?: number[];
}

const Demux4: React.FC<GateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColors = outputs.map((v) => (v === 1 ? "green" : "#1976d2"));

	return (
		<svg width="120" height="100">
			<rect
				x="25"
				y="10"
				width="70"
				height="80"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Wejście D */}
			<line
				x1="0"
				y1="50"
				x2="25"
				y2="50"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<text x="30" y="53" fontSize="10" fill="#1976d2" fontWeight="bold">
				D
			</text>

			<line
				x1="50"
				y1="0"
				x2="50"
				y2="10"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="70"
				y1="0"
				x2="70"
				y2="10"
				stroke={inputColors[2] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Wyjścia */}
			{[0, 1, 2, 3].map((i) => (
				<line
					key={i}
					x1="95"
					y1={25 + i * 18}
					x2="120"
					y2={25 + i * 18}
					stroke={outputColors[i] || "#1976d2"}
					strokeWidth="3"
				/>
			))}

			{[0, 1, 2, 3].map((i) => (
				<text
					key={`lbl${i}`}
					x="85"
					y={28 + i * 18}
					fontSize="10"
					fill="#1976d2"
					fontWeight="bold"
				>
					{i}
				</text>
			))}

			{/* Wejścia adresowe */}
			<text x="45" y="20" fontSize="9" fill="#1976d2">
				A0
			</text>
			<text x="65" y="20" fontSize="9" fill="#1976d2">
				A1
			</text>
		</svg>
	);
};

export default Demux4;
