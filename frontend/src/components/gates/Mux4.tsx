import React from "react";

interface GateProps {
	inputs?: number[];
	outputs?: number[];
}

const Mux4: React.FC<GateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColors = outputs.map((v) => (v === 1 ? "green" : "#1976d2"));

	return (
		<svg width="120" height="110">
			{/* Obudowa */}
			<rect
				x="25"
				y="10"
				width="70"
				height="80"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
				rx="6"
			/>

			{/* Linie wejściowe danych */}
			{[0, 1, 2, 3].map((i) => (
				<line
					key={i}
					x1="0"
					y1={25 + i * 18}
					x2="25"
					y2={25 + i * 18}
					stroke={inputColors[i] || "#1976d2"}
					strokeWidth="3"
				/>
			))}

			<line
				x1="50"
				y1="0"
				x2="50"
				y2="10"
				stroke={inputColors[4] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="70"
				y1="0"
				x2="70"
				y2="10"
				stroke={inputColors[5] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* Linia Enable (6) - DÓŁ */}
			<line
				x1="60"
				y1="110" // Od dołu
				x2="60"
				y2="90" // Do obudowy
				stroke={inputColors[6] || "#1976d2"}
				strokeWidth="3"
			/>
			<circle
				cx="60"
				cy="95"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Linie wyjściowe */}
			<line
				x1="95"
				y1="50"
				x2="120"
				y2="50"
				stroke={outputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>

			<circle
				cx="100"
				cy="50"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Etykiety wejść */}
			{[0, 1, 2, 3].map((i) => (
				<text
					key={`lbl${i}`}
					x="28"
					y={28 + i * 18}
					fontSize="10"
					fill="#1976d2"
					fontWeight="bold"
				>
					{i}
				</text>
			))}

			{/* Etykieta wyjścia */}
			<text x="80" y="53" fontSize="10" fill="#1976d2" fontWeight="bold">
				!Y
			</text>

			{/* Etykiety sterujące */}
			<text x="45" y="20" fontSize="9" fill="#1976d2">
				A0
			</text>
			<text x="65" y="20" fontSize="9" fill="#1976d2">
				A1
			</text>
			<text x="55" y="88" fontSize="9" fill="#1976d2">
				!E
			</text>
		</svg>
	);
};

export default Mux4;
