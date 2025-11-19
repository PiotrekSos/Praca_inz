import React from "react";

interface GateProps {
	inputs?: number[];
	outputs?: number[];
}

const Demux16: React.FC<GateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColors = outputs.map((v) => (v === 1 ? "green" : "#1976d2"));

	return (
		<svg width="120" height="340">
			<rect
				x="25"
				y="10"
				width="70"
				height="310"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
				rx="6"
			/>

			{/* Wejście D */}
			<line
				x1="0"
				y1="165"
				x2="25"
				y2="165"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<text x="30" y="168" fontSize="10" fill="#1976d2" fontWeight="bold">
				D
			</text>

			<line
				x1="40"
				y1="0"
				x2="40"
				y2="10"
				stroke={inputColors[16] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="55"
				y1="0"
				x2="55"
				y2="10"
				stroke={inputColors[17] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="70"
				y1="0"
				x2="70"
				y2="10"
				stroke={inputColors[18] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="85"
				y1="0"
				x2="85"
				y2="10"
				stroke={inputColors[19] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Linia Enable (5) - DÓŁ */}
			<line
				x1="60"
				y1="340"
				x2="60"
				y2="320"
				stroke={inputColors[5] || "#1976d2"}
				strokeWidth="3"
			/>
			<circle
				cx="60"
				cy="325"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Wyjścia */}
			{[...Array(16)].map((_, i) => (
				<line
					key={i}
					x1="95"
					y1={25 + i * 18.5}
					x2="120"
					y2={25 + i * 18.5}
					stroke={outputColors[i] || "#1976d2"}
					strokeWidth="3"
				/>
			))}

			{[...Array(16)].map((_, i) => (
				<text
					key={`lbl${i}`}
					x="80"
					y={28 + i * 18.5}
					fontSize="8"
					fill="#1976d2"
					fontWeight="bold"
				>
					!{i}
				</text>
			))}

			{[...Array(16)].map((_, i) => (
				<circle
					key={i}
					cx="100"
					cy={25 + i * 18.5}
					r="5"
					fill="white"
					stroke="#1976d2"
					strokeWidth="2"
				/>
			))}

			{/* Adresowe wejścia */}
			{["A0", "A1", "A2", "A3"].map((a, i) => (
				<text
					key={a}
					x={35 + i * 15}
					y="20"
					fontSize="8"
					fill="#1976d2"
				>
					{a}
				</text>
			))}
			<text x="55" y="315" fontSize="10" fill="#1976d2">
				!E
			</text>
		</svg>
	);
};

export default Demux16;
