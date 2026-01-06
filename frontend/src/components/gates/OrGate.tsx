import React from "react";

interface OrGateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const OrGate: React.FC<OrGateProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="100" height="60">
			<line
				x1="0"
				y1="20"
				x2="28"
				y2="20"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="28"
				y2="40"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>

			<path
				d="M 20 6 H 38 A 48 48 0 0 1 80 30 A 48 48 0 0 1 38 54 H 20 Q 32 30 20 6 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default OrGate;
