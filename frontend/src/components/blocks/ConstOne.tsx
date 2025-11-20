import React from "react";

interface Props {
	showColors?: boolean;
}

const ConstOne: React.FC<Props> = ({ showColors = true }) => {
	// Logika kolorów
	const bodyColor = showColors ? "#1976d2" : "black";
	const outputColor = showColors ? "green" : "black";

	return (
		<svg width="100" height="60">
			<rect
				x="20"
				y="10"
				width="60"
				height="40"
				fill="white"
				stroke={bodyColor} // Użycie zmiennej
				strokeWidth="2"
				rx="6"
			/>
			<text
				x="50"
				y="38"
				fontSize="20"
				textAnchor="middle"
				fill={bodyColor} // Użycie zmiennej
				fontWeight="bold"
				style={{ userSelect: "none" }} // Dodatkowo: blokada zaznaczania tekstu
			>
				1
			</text>

			{/* nóżka wyjściowa */}
			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor} // Użycie zmiennej
				strokeWidth="3"
			/>
		</svg>
	);
};

export default ConstOne;
