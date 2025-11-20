import React from "react";

type ToggleSwitchProps = {
	value: boolean;
	onChange: (newValue: boolean) => void;
	showColors?: boolean; // <-- Nowy prop
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
	value,
	onChange,
	showColors = true,
}) => {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(!value);
	};

	// Kolory
	const mainStroke = showColors ? "#1976d2" : "black";

	// Tło suwaka:
	// Kolor: Niebieski (ON) / Szary (OFF)
	// Mono: Czarny (ON) / Biały (OFF)
	const trackFill = showColors
		? value
			? "#1976d2"
			: "#ccc"
		: value
		? "black"
		: "white";

	// W trybie mono dodajemy obrys dla białego tła, żeby było je widać
	const trackStroke = !showColors ? "black" : "none";
	const trackStrokeWidth = !showColors ? 1 : 0;

	const outputColor = showColors ? (value ? "green" : "#1976d2") : "black";

	return (
		<svg width="100" height="60">
			{/* Ramka zewnętrzna */}
			<rect
				x="5"
				y="10"
				width="70"
				height="40"
				rx="8"
				ry="8"
				fill="white"
				stroke={mainStroke}
				strokeWidth="2"
			/>

			{/* Tor suwaka */}
			<rect
				x="15"
				y="20"
				width="50"
				height="20"
				rx="10"
				fill={trackFill}
				stroke={trackStroke}
				strokeWidth={trackStrokeWidth}
				onMouseDown={handleClick}
				cursor="pointer"
			/>

			{/* Gałka */}
			<circle
				cx={value ? 55 : 25}
				cy="30"
				r="8"
				fill="white"
				stroke={mainStroke}
				strokeWidth="2"
				onMouseDown={handleClick}
				cursor="pointer"
			/>

			{/* nóżka wyjściowa */}
			<line
				x1="75"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default ToggleSwitch;
