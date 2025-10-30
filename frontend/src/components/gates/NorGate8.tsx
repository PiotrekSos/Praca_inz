import React from "react";

const NorGate8: React.FC = () => (
	<svg width="160" height="160">
		{/* Kształt NOR */}
		<path
			d="M50,20 Q100,90 50,160 Q120,160 140,90 Q120,20 50,20 Z"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
		{/* Bańka negacji */}
		<circle
			cx="145"
			cy="90"
			r="5"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>
	</svg>
);

export default NorGate8;
