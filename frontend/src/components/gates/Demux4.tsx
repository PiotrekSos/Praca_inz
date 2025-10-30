import React from "react";

const Demux4: React.FC = () => (
	<svg width="100" height="100">
		<rect
			x="15"
			y="10"
			width="70"
			height="80"
			fill="white"
			stroke="#1976d2"
			strokeWidth="2"
		/>

		<text x="20" y="53" fontSize="10" fill="#1976d2" fontWeight="bold">
			D
		</text>
		{[0, 1, 2, 3].map((i) => (
			<text
				key={i}
				x="70"
				y={28 + i * 20}
				fontSize="10"
				fill="#1976d2"
				fontWeight="bold"
			>
				{i}
			</text>
		))}
		<text x="35" y="8" fontSize="9" fill="#1976d2">
			A0
		</text>
		<text x="55" y="8" fontSize="9" fill="#1976d2">
			A1
		</text>
	</svg>
);

export default Demux4;
