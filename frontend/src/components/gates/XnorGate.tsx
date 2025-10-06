import React from "react";

const XnorGate: React.FC = () => (
	<svg width="100" height="60">
		<path
			d="M15,10 Q45,30 15,50"
			fill="none"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<path
			d="M25,10 Q55,30 25,50 Q65,50 85,30 Q65,10 25,10 Z"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<circle
			cx="93"
			cy="30"
			r="5"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
	</svg>
);

export default XnorGate;
