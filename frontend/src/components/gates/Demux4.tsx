import React from "react";

interface GateProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const Demux4: React.FC<GateProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";

	const bodyColor = showColors ? "#1976d2" : "black";

	return (
		<svg width="120" height="110">
			<rect
				x="25"
				y="10"
				width="70"
				height="80"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
				rx="6"
			/>

			<line
				x1="0"
				y1="50"
				x2="25"
				y2="50"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<text
				x="30"
				y="53"
				fontSize="10"
				fill={bodyColor}
				fontWeight="bold"
				style={{ userSelect: "none" }}
			>
				D
			</text>

			<line
				x1="50"
				y1="0"
				x2="50"
				y2="10"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>
			<line
				x1="70"
				y1="0"
				x2="70"
				y2="10"
				stroke={getColor(inputs[2])}
				strokeWidth="3"
			/>

			<line
				x1="60"
				y1="110"
				x2="60"
				y2="90"
				stroke={getColor(inputs[3])}
				strokeWidth="3"
			/>
			<circle
				cx="60"
				cy="95"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			{[0, 1, 2, 3].map((i) => (
				<line
					key={i}
					x1="95"
					y1={25 + i * 18}
					x2="120"
					y2={25 + i * 18}
					stroke={getColor(outputs[i])}
					strokeWidth="3"
				/>
			))}

			{[0, 1, 2, 3].map((i) => (
				<text
					key={`lbl${i}`}
					x="85"
					y={28 + i * 18}
					fontSize="10"
					fill={bodyColor}
					fontWeight="bold"
					style={{ userSelect: "none" }}
				>
					!{i}
				</text>
			))}

			{[0, 1, 2, 3].map((i) => (
				<circle
					key={i}
					cx="100"
					cy={25 + i * 18}
					r="5"
					fill="white"
					stroke={bodyColor}
					strokeWidth="2"
				/>
			))}

			<text
				x="45"
				y="20"
				fontSize="9"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				A0
			</text>
			<text
				x="65"
				y="20"
				fontSize="9"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				A1
			</text>
			<text
				x="55"
				y="88"
				fontSize="9"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				!E
			</text>
		</svg>
	);
};

export default Demux4;
