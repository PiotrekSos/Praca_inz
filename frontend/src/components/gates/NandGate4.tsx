import React from "react";

interface NandGate4Props {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const NandGate4: React.FC<NandGate4Props> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="140" height="100">
			{[0, 1, 2, 3].map((i) => (
				<line
					key={i}
					x1="0"
					y1={25 + i * 17}
					x2="30"
					y2={25 + i * 17}
					stroke={getColor(inputs[i])}
					strokeWidth="3"
				/>
			))}

			<path
				d="M20,15 H60 A30,30 0 0,1 60,85 H20 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			<circle
				cx="100"
				cy="50"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			<line
				x1="105"
				y1="50"
				x2="120"
				y2="50"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NandGate4;
