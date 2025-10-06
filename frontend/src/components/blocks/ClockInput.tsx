import React from "react";

const ClockInput: React.FC = () => (
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
		<path
			d="M35,40 V30 H35 V40 H50 V25 H65 V35"
			stroke="#1976d2"
			strokeWidth="2"
			fill="none"
		/>
	</svg>
);

export default ClockInput;
