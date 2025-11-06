import React from "react";

type ToggleSwitchProps = {
	value: boolean;
	onChange: (newValue: boolean) => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange }) => {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(!value);
	};

	return (
		<svg width="100" height="60">
			<rect
				x="5"
				y="10"
				width="70"
				height="40"
				rx="8"
				ry="8"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			<rect
				x="15"
				y="20"
				width="50"
				height="20"
				rx="10"
				fill={value ? "#1976d2" : "#ccc"}
				onMouseDown={handleClick}
				cursor="pointer"
			/>
			<circle
				cx={value ? 55 : 25}
				cy="30"
				r="8"
				fill="white"
				stroke="#1976d2"
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
				stroke={value ? "green" : "#1976d2"}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default ToggleSwitch;
