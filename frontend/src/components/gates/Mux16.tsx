import React from "react";

interface GateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean; // <-- Nowy prop
}

const Mux16: React.FC<GateProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="120" height="340">
			<rect
				x="25"
				y="10"
				width="70"
				height="310"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
				rx="6"
			/>

			{/* Linie wejściowe danych (D0-D15) */}
			{[...Array(16)].map((_, i) => (
				<line
					key={i}
					x1="0"
					y1={25 + i * 18.5}
					x2="25"
					y2={25 + i * 18.5}
					stroke={getColor(inputs[i])}
					strokeWidth="3"
				/>
			))}

			{/* Linie sterujące (A0-A3) - inputs[16-19] */}
			<line
				x1="40"
				y1="0"
				x2="40"
				y2="10"
				stroke={getColor(inputs[16])}
				strokeWidth="3"
			/>
			<line
				x1="55"
				y1="0"
				x2="55"
				y2="10"
				stroke={getColor(inputs[17])}
				strokeWidth="3"
			/>
			<line
				x1="70"
				y1="0"
				x2="70"
				y2="10"
				stroke={getColor(inputs[18])}
				strokeWidth="3"
			/>
			<line
				x1="85"
				y1="0"
				x2="85"
				y2="10"
				stroke={getColor(inputs[19])}
				strokeWidth="3"
			/>

			{/* Linia Enable (20) - DÓŁ */}
			<line
				x1="60"
				y1="340"
				x2="60"
				y2="320"
				stroke={getColor(inputs[20])}
				strokeWidth="3"
			/>
			<circle
				cx="60"
				cy="325"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Linie wyjściowe */}
			<line
				x1="95"
				y1="165"
				x2="120"
				y2="165"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>

			<circle
				cx="100"
				cy="165"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{/* Etykiety wejść */}
			{[...Array(16)].map((_, i) => (
				<text
					key={`lbl${i}`}
					x="28"
					y={28 + i * 18.5}
					fontSize="8"
					fill={bodyColor}
					fontWeight="bold"
					style={{ userSelect: "none" }}
				>
					{i}
				</text>
			))}

			{/* Wyjście */}
			<text
				x="80"
				y="168"
				fontSize="10"
				fill={bodyColor}
				fontWeight="bold"
				style={{ userSelect: "none" }}
			>
				!Y
			</text>

			{/* Adresowe wejścia */}
			{["A0", "A1", "A2", "A3"].map((a, i) => (
				<text
					key={a}
					x={35 + i * 15}
					y="20"
					fontSize="8"
					fill={bodyColor}
					style={{ userSelect: "none" }}
				>
					{a}
				</text>
			))}
			<text
				x="55"
				y="315"
				fontSize="10"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				!E
			</text>
		</svg>
	);
};

export default Mux16;
