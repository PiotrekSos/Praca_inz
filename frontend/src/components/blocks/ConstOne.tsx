import React from "react";

const ConstOne: React.FC = () => (
	<svg width="100" height="60">
		<rect
			x="20"
			y="10"
			width="60"
			height="40"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
			rx="6"
		/>
		<text
			x="50"
			y="38"
			fontSize="20"
			textAnchor="middle"
			fill="#1976d2"
			fontWeight="bold"
		>
			1
		</text>
	</svg>
);

export default ConstOne;
