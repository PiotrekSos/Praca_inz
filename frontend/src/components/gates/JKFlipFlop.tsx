import React from "react";

const JKFlipFlop: React.FC = () => (
	<svg width="120" height="100">
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
		<text x="50" y="55" fontSize="16" fill="#1976d2" fontWeight="bold">
			JK
		</text>

		{/* Wejścia */}
		<text x="35" y="38" fontSize="12" fill="#1976d2">
			J
		</text>

		<text x="35" y="55" fontSize="12" fill="#1976d2">
			K
		</text>

		<text x="35" y="72" fontSize="10" fill="#555">
			CLK
		</text>

		{/* Wyjścia */}
		<text x="78" y="38" fontSize="12" fill="#1976d2">
			Q
		</text>

		<text x="73" y="68" fontSize="12" fill="#1976d2">
			!Q
		</text>
	</svg>
);

export default JKFlipFlop;
