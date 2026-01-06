import React from "react";

type Props = {
	value?: number;
	showColors?: boolean;
};

const ClockInput: React.FC<Props> = ({ value = 0, showColors = true }) => {
	const bodyColor = showColors ? "#1976d2" : "black";
	const signalColor = showColors ? (value ? "green" : "#1976d2") : "black";

	return (
		<svg width="100" height="60">
			<rect
				x="20"
				y="10"
				width="60"
				height="40"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
				rx="6"
			/>

			<path
				d="M30,40 V25 H50 V40 H70 V25"
				stroke={signalColor}
				strokeWidth="3"
				fill="none"
			/>

			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={signalColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default ClockInput;
