import React from "react";

interface NotGateProps {
	inputs?: number[];
	outputs?: number[];
}

const NotGate: React.FC<NotGateProps> = ({ inputs = [], outputs = [] }) => {
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

			{/* Kształt bramki (Trójkąt) */}
			<polygon
				points="20,6 68,30 20,54"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Kółeczko negacji */}
			{/* Szczyt trójkąta jest na x=68. Promień r=5, więc środek cx=73 */}
			<circle
				cx="73"
				cy="30"
				r="5"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* Linia wyjściowa */}
			{/* Zaczyna się za kółkiem (x=78) */}
			<line
				x1="78"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NotGate;
