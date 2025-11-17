import React from "react";

interface RamProps {
	inputs?: number[];
	outputs?: number[];
}

const Ram16x4: React.FC<RamProps> = ({ inputs = [], outputs = [] }) => {
	// Piny: 4x D (0-3), 4x A (4-7), CS (8), WE (9)
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColors = outputs.map((v) => (v === 1 ? "green" : "#1976d2"));

	return (
		<svg width="140" height="180" viewBox="0 0 140 180">
			{/* Obudowa */}
			<rect
				x="30"
				y="10"
				width="80"
				height="160"
				fill="#ffffffff" // Żółty kolor
				stroke="#1976d2"
				strokeWidth="2"
				rx="6"
			/>

			<text
				x="70"
				y="85"
				writingMode="vertical-rl"
				textAnchor="middle"
				fontSize="12"
				fontWeight="bold"
				fill="#1976d2"
			>
				PAMIĘĆ RAM 16 x 4
			</text>

			{/* --- Linie Wejściowe DANYCH (D0-D3) --- */}
			{[0, 1, 2, 3].map((i) => (
				<React.Fragment key={`d-${i}`}>
					<line
						x1="0"
						y1={30 + i * 15}
						x2="30"
						y2={30 + i * 15}
						stroke={inputColors[i] || "#1976d2"}
						strokeWidth="3"
					/>
					<text x="35" y={33 + i * 15} fontSize="10" fill="#1976d2">
						D{i}
					</text>
				</React.Fragment>
			))}

			{/* --- Linie Wejściowe ADRESOWE (A0-A3) --- */}
			{[0, 1, 2, 3].map((i) => (
				<React.Fragment key={`a-${i}`}>
					<line
						x1="0"
						y1={100 + i * 15}
						x2="30"
						y2={100 + i * 15}
						stroke={inputColors[4 + i] || "#1976d2"}
						strokeWidth="3"
					/>
					<text x="35" y={103 + i * 15} fontSize="10" fill="#1976d2">
						A{i}
					</text>
				</React.Fragment>
			))}

			{/* --- Linie Sterujące (CS, WE) --- */}
			<line
				x1="70"
				y1="0"
				x2="70"
				y2="10"
				stroke={inputColors[8] || "#1976d2"}
				strokeWidth="3"
			/>
			<text
				x="70"
				y="20"
				fontSize="10"
				fill="#1976d2"
				textAnchor="middle"
			>
				CS
			</text>

			<line
				x1="70"
				y1="180"
				x2="70"
				y2="170"
				stroke={inputColors[9] || "#1976d2"}
				strokeWidth="3"
			/>
			<text
				x="70"
				y="168"
				fontSize="10"
				fill="#1976d2"
				textAnchor="middle"
			>
				WE
			</text>

			{/* --- Linie Wyjściowe DANYCH (Q0-Q3) --- */}
			{[0, 1, 2, 3].map((i) => (
				<React.Fragment key={`q-${i}`}>
					<line
						x1="110"
						y1={65 + i * 15}
						x2="140"
						y2={65 + i * 15}
						stroke={outputColors[i] || "#1976d2"}
						strokeWidth="3"
					/>
					<text x="95" y={68 + i * 15} fontSize="10" fill="#1976d2">
						Q{i}
					</text>
				</React.Fragment>
			))}
		</svg>
	);
};

export default Ram16x4;
