import React from "react";

const DFlipFlop: React.FC = () => (
	<svg width="120" height="80">
		<rect
			x="30"
			y="20"
			width="60"
			height="40"
			rx="6"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>

		{/* Etykieta główna */}
		<text
			x="60"
			y="45"
			textAnchor="middle"
			fontSize="16"
			fontWeight="bold"
			fill="#1976d2"
		>
			D
		</text>

		{/* Wejście D */}
		<text x="35" y="38" fontSize="12" fill="#1976d2">
			D
		</text>

		{/* CLK */}
		<text x="35" y="53" fontSize="10" fill="#555">
			CLK
		</text>

		{/* Wyjścia */}
		<text x="78" y="38" fontSize="12" fill="#1976d2">
			Q
		</text>

		<text x="73" y="53" fontSize="12" fill="#1976d2">
			!Q
		</text>
	</svg>
);

export default DFlipFlop;
