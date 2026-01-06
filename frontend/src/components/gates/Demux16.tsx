import React from "react";

interface GateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const Demux16: React.FC<GateProps> = ({
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

			<line
				x1="0"
				y1="165"
				x2="25"
				y2="165"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<text
				x="30"
				y="168"
				fontSize="10"
				fill={bodyColor}
				fontWeight="bold"
				style={{ userSelect: "none" }}
			>
				D
			</text>

			{[0, 1, 2, 3].map((i) => (
				<line
					key={i}
					x1={40 + i * 15}
					y1="0"
					x2={40 + i * 15}
					y2="10"
					stroke={getColor(inputs[1 + i])}
					strokeWidth="3"
				/>
			))}

			<line
				x1="60"
				y1="340"
				x2="60"
				y2="320"
				stroke={getColor(inputs[5])}
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

			{[...Array(16)].map((_, i) => (
				<line
					key={i}
					x1="95"
					y1={25 + i * 18.5}
					x2="120"
					y2={25 + i * 18.5}
					stroke={getColor(outputs[i])}
					strokeWidth="3"
				/>
			))}

			{[...Array(16)].map((_, i) => (
				<text
					key={`lbl${i}`}
					x="80"
					y={28 + i * 18.5}
					fontSize="8"
					fill={bodyColor}
					fontWeight="bold"
					style={{ userSelect: "none" }}
				>
					!{i}
				</text>
			))}

			{[...Array(16)].map((_, i) => (
				<circle
					key={i}
					cx="100"
					cy={25 + i * 18.5}
					r="5"
					fill="white"
					stroke={bodyColor}
					strokeWidth="2"
				/>
			))}

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

export default Demux16;
