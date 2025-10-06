import React from "react";

const LampOutput: React.FC = () => (
	<svg width="100" height="60">
		<circle
			cx="50"
			cy="30"
			r="20"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<circle
			cx="50"
			cy="30"
			r="10"
			fill="#f8f8f8"
			stroke="#1976d2"
			strokeWidth="1.5"
		/>
		<text x="50" y="55" fontSize="10" textAnchor="middle" fill="#1976d2">
			LAMP
		</text>
	</svg>
);

export default LampOutput;
