import React from "react";

interface Props {
	showColors?: boolean;
}

const ConstOne: React.FC<Props> = ({ showColors = true }) => {
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
				stroke={bodyColor}
				strokeWidth="2"
				rx="6"
			/>
			<text
				x="50"
				y="38"
				fontSize="20"
				textAnchor="middle"
				fill={bodyColor}
				fontWeight="bold"
				style={{ userSelect: "none" }}
			>
				1
			</text>

			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default ConstOne;
