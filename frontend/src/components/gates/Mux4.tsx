import React from "react";

const Mux4: React.FC = () => (
	<svg width="100" height="100">
		{/* Prostokąt obudowy */}
		<rect
			x="15"
			y="10"
			width="70"
			height="80"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>

		{/* Wejścia danych z lewej strony */}
		{[0, 1, 2, 3].map((i) => (
			<React.Fragment key={`in${i}`}>
				<text
					x="25"
					y={28 + i * 20}
					fontSize="10"
					fill="#1976d2"
					fontWeight="bold"
				>
					{i}
				</text>
			</React.Fragment>
		))}

		{/* Wyjście Y po prawej */}
		<text x="75" y="53" fontSize="10" fill="#1976d2" fontWeight="bold">
			Y
		</text>

		{/* Wejścia sterujące A0, A1 u góry */}
		<text x="35" y="8" fontSize="9" fill="#1976d2">
			A0
		</text>
		<text x="55" y="8" fontSize="9" fill="#1976d2">
			A1
		</text>
	</svg>
);

export default Mux4;
