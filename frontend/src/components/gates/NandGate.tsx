import React from "react";

const NandGate: React.FC = () => (
	<svg width="100" height="60">
		<rect
			x="10"
			y="10"
			width="60"
			height="40"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<path
			d="M70,10 A20,20 0 0,1 70,50"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<circle
			cx="95"
			cy="30"
			r="5"
			stroke="#1976d2"
			strokeWidth="2"
			fill="white"
		/>
	</svg>
);

export default NandGate;
