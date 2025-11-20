import React from "react";

interface BufferGateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean; // <-- Nowy prop
}

const BufferGate: React.FC<BufferGateProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";

	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="100" height="60">
			{/* Linia wejściowa */}
			<line
				x1="0"
				y1="30"
				x2="20"
				y2="30"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>

			{/* Kształt bramki */}
			<polygon
				points="20,6 68,30 20,54"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="68"
				y1="30"
				x2="100"
				y2="30"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default BufferGate;
