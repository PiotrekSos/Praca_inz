import React from "react";

interface Props {
	showColors?: boolean;
}

const ConstZero: React.FC<Props> = ({ showColors = true }) => {
	// Dla zera logicznego, kolor wyjścia to zazwyczaj niebieski (ten sam co ramki)
	const color = showColors ? "#1976d2" : "black";

	return (
		<svg width="100" height="60">
			<rect
				x="20"
				y="10"
				width="60"
				height="40"
				fill="white"
				stroke={color}
				strokeWidth="2"
				rx="6"
			/>
			<text
				x="50"
				y="38"
				fontSize="20"
				textAnchor="middle"
				fill={color}
				fontWeight="bold"
				style={{ userSelect: "none" }}
			>
				0
			</text>

			{/* nóżka wyjściowa */}
			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={color}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default ConstZero;
