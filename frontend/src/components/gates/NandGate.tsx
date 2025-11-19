import React from "react";

interface NandGateProps {
	inputs?: number[]; // mogą być undefined
	outputs?: number[];
}

const NandGate: React.FC<NandGateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			{/* --- linie wejściowe (POZYCJE NIENARUSZONE) --- */}
			<line
				x1="0"
				y1="20"
				x2="20"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="20"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* --- kształt bramki AND (baza dla NAND) --- */}
			{/* Identyczny jak w AndGate: wysokość 8a (48px), promień 4a (24px) */}
			<path
				d="M 20 6 H 56 A 24 24 0 0 1 56 54 H 20 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- kółeczko negacji --- */}
			{/* Korpus kończy się na x=80. Kółko r=5, więc środek cx=85 (styka się z korpusem) */}
			<circle
				cx="85"
				cy="30"
				r="5"
				stroke="#1976d2"
				strokeWidth="2"
				fill="white"
			/>

			{/* --- linia wyjściowa --- */}
			{/* Zaczyna się za kółkiem (x=90) i idzie do końca (x=100) */}
			<line
				x1="90"
				y1="30"
				x2="100"
				y2="30"
				stroke={outputColor}
				strokeWidth="3"
			/>
		</svg>
	);
};

export default NandGate;
