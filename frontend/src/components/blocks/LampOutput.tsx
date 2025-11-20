import React from "react";

type Props = {
	isOn?: boolean;
	showColors?: boolean; // <-- Nowy prop
};

const LampOutput: React.FC<Props> = ({ isOn = false, showColors = true }) => {
	// Logika kolorów
	const bodyColor = showColors ? "#1976d2" : "black";

	// W trybie mono: ON = ciemny szary/czarny, OFF = biały
	const bulbFill = showColors
		? isOn
			? "yellow"
			: "white"
		: isOn
		? "#333"
		: "white";

	const inputColor = showColors ? (isOn ? "green" : "#1976d2") : "black";

	return (
		<svg width="100" height="60">
			<circle
				cx="50"
				cy="30"
				r="20"
				fill={bulbFill}
				stroke={bodyColor}
				strokeWidth="2"
			/>
			<circle
				cx="50"
				cy="30"
				r="10"
				fill={showColors ? "#f8f8f8" : isOn ? "#555" : "#fff"} // Środek też ciemnieje
				stroke={bodyColor}
				strokeWidth="1.5"
			/>

			{/* nóżka wejściowa */}
			<line
				x1="0"
				y1="30"
				x2="30"
				y2="30"
				stroke={inputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default LampOutput;
