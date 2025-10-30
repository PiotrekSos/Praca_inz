import React from "react";

const Mux16: React.FC = () => (
	<svg width="100" height="320">
		<rect
			x="15"
			y="10"
			width="70"
			height="300"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>

		{[...Array(16)].map((_, i) => (
			<text
				key={i}
				x="23"
				y={25 + i * 18.5}
				fontSize="8"
				fill="#1976d2"
				fontWeight="bold"
			>
				{i}
			</text>
		))}
		<text x="75" y="163" fontSize="10" fill="#1976d2" fontWeight="bold">
			Y
		</text>
		<text x="20" y="8" fontSize="8" fill="#1976d2">
			A0
		</text>
		<text x="35" y="8" fontSize="8" fill="#1976d2">
			A1
		</text>
		<text x="50" y="8" fontSize="8" fill="#1976d2">
			A2
		</text>
		<text x="65" y="8" fontSize="8" fill="#1976d2">
			A3
		</text>
	</svg>
);

export default Mux16;
