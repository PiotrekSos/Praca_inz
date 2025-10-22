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
				width="90"
				height="40"
				rx="8"
				ry="8"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			<rect
				x="25"
				y="20"
				width="50"
				height="20"
				rx="10"
				fill={value ? "#1976d2" : "#ccc"}
				onMouseDown={handleClick}
				cursor="pointer"
			/>
			<circle
				cx={value ? 65 : 35}
				cy="30"
				r="8"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
				onMouseDown={handleClick}
				cursor="pointer"
			/>
		</svg>
	);
};

export default ToggleSwitch;
