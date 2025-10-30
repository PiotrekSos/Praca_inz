import React from "react";

const NandGate8: React.FC = () => (
	<svg width="160" height="160">
		{/* Kształt NAND */}
		<path
			d="M20,20 H70 A40,40 0 0,1 70,160 H20 Z"
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

export default NandGate8;
