import React from "react";

const NorGate4: React.FC = () => (
	<svg width="140" height="100">
		{/* Kształt NOR */}
		<path
			d="M40,20 Q80,50 40,80 Q90,80 110,50 Q90,20 40,20 Z"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		{/* Bańka negacji */}
		<circle
			cx="115"
			cy="50"
			r="5"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
	</svg>
);

export default NorGate4;
