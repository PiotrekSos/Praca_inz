import React from "react";

interface OrGateProps {
	inputs?: number[];
	outputs?: number[];
}

const OrGate: React.FC<OrGateProps> = ({ inputs = [], outputs = [] }) => {
	const inputColors = inputs.map((v) => (v === 1 ? "green" : "#1976d2"));
	const outputColor = outputs[0] === 1 ? "green" : "#1976d2";

	return (
		<svg width="100" height="60">
			{/* --- linie wejściowe --- */}
			{/* Wydłużamy x2 do 28, aby sięgnęły głębszego wcięcia z tyłu */}
			<line
				x1="0"
				y1="20"
				x2="28"
				y2="20"
				stroke={inputColors[0] || "#1976d2"}
				strokeWidth="3"
			/>
			<line
				x1="0"
				y1="40"
				x2="28"
				y2="40"
				stroke={inputColors[1] || "#1976d2"}
				strokeWidth="3"
			/>

			{/* --- kształt bramki OR (z prostym odcinkiem 3a) --- */}
			{/*
                M 20 6: Start lewy górny róg
                H 38:   Pozioma linia w prawo (długość 3a = 18px)
                A 48...: Górny łuk do szpica (80, 30)
                A 48...: Dolny łuk powrotny do końca dolnej prostej (38, 54)
                H 20:   Pozioma linia w lewo (powrót do lewego dolnego rogu)
                Q ...:  Tylny wklęsły łuk
            */}
			<path
				d="M 20 6 H 38 A 48 48 0 0 1 80 30 A 48 48 0 0 1 38 54 H 20 Q 32 30 20 6 Z"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
			/>

			{/* --- linia wyjściowa --- */}
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

export default OrGate;
