import React from "react";

const NandGate4: React.FC = () => (
	<svg width="140" height="100">
		{/* Kształt NAND */}
		<path
			d="M40,20 H80 A30,30 0 0,1 80,80 H40 Z"
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

export default NandGate4;
