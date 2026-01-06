import React from "react";

interface NotGateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const NotGate: React.FC<NotGateProps> = ({
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
				y1="30"
				x2="20"
				y2="30"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>

			<polygon
				points="20,6 68,30 20,54"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			<circle
				cx="73"
				cy="30"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			<line
				x1="78"
				y1="30"
				x2="100"
				y2="30"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NotGate;
