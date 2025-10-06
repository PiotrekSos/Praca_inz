import React from "react";

const NotGate: React.FC = () => (
	<svg width="100" height="60">
		<polygon
			points="20,10 80,30 20,50"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<circle
			cx="88"
			cy="30"
			r="5"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
	</svg>
);

export default NotGate;
