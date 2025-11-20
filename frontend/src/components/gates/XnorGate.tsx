import React from "react";

interface XnorGateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const XnorGate: React.FC<XnorGateProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="100" height="60">
			{/* --- linie wejściowe --- */}
			<line
				x1="0"
				y1="20"
				x2="18"
				y2="20"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="18"
				y2="40"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>

			{/* --- Dodatkowa krzywa wejściowa --- */}
			<path
				d="M 10 6 Q 34 30 10 54"
				fill="none"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* --- kształt bramki OR --- */}
			<path
				d="M 20 6 H 38 A 48 48 0 0 1 80 30 A 48 48 0 0 1 38 54 H 20 Q 44 30 20 6 Z"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* --- kółeczko negacji --- */}
			<circle
				cx="85"
				cy="30"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* --- linia wyjściowa --- */}
			<line
				x1="90"
				y1="30"
				x2="100"
				y2="30"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default XnorGate;
