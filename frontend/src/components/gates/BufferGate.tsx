import React from "react";

interface BufferGateProps {
	inputs?: number[];
	outputs?: number[];
}

const BufferGate: React.FC<BufferGateProps> = ({
	inputs = [],
	outputs = [],
}) => {
	const inputColor = inputs[0] === 1 ? "green" : "#1976d2";
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			{/* Linia wejściowa */}
			<line
				x1="0"
				y1="30"
				x2="20"
				y2="30"
				stroke={inputColor}
				strokeWidth="3"
			/>

			{/* Kształt bramki */}
			<polygon
				points="20,10 80,30 20,50"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			<line
				x1="80"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default BufferGate;
