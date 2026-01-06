import React from "react";

interface FlipFlopProps {
	inputs?: number[];
	outputs?: number[];
	showColors?: boolean;
}

const DFlipFlop: React.FC<FlipFlopProps> = ({
	inputs = [],
	outputs = [],
	showColors = true,
}) => {
	const getColor = (val: number | undefined) =>
		showColors ? (val === 1 ? "green" : "#1976d2") : "black";
	const bodyColor = showColors ? "#1976d2" : "black";
	const clockColor = showColors ? "#555" : "black";

	return (
		<svg width="120" height="80">
			<line
				x1="10"
				y1="35"
				x2="30"
				y2="35"
				stroke={getColor(inputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="10"
				y1="50"
				x2="30"
				y2="50"
				stroke={getColor(inputs[1])}
				strokeWidth="3"
			/>

			<line
				x1="60"
				y1="5"
				x2="60"
				y2="20"
				stroke={getColor(inputs[2])}
				strokeWidth="3"
			/>
			<line
				x1="60"
				y1="75"
				x2="60"
				y2="60"
				stroke={getColor(inputs[3])}
				strokeWidth="3"
			/>

			<rect
				x="30"
				y="20"
				width="60"
				height="40"
				rx="6"
				fill="white"
				stroke={bodyColor}
				strokeWidth="2"
			/>

			<circle
				cx="60"
				cy="15"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="1.5"
			/>
			<circle
				cx="60"
				cy="65"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="1.5"
			/>

			<text
				x="35"
				y="35"
				fontSize="12"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				D
			</text>
			<text
				x="35"
				y="50"
				fontSize="10"
				fill={clockColor}
				style={{ userSelect: "none" }}
			>
				CLK
			</text>
			<text
				x="58"
				y="30"
				fontSize="10"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				!S
			</text>
			<text
				x="58"
				y="55"
				fontSize="10"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				!R
			</text>

			<line
				x1="90"
				y1="35"
				x2="110"
				y2="35"
				stroke={getColor(outputs[0])}
				strokeWidth="3"
			/>
			<line
				x1="90"
				y1="50"
				x2="110"
				y2="50"
				stroke={getColor(outputs[1])}
				strokeWidth="3"
			/>

			<text
				x="78"
				y="35"
				fontSize="12"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				Q
			</text>
			<text
				x="73"
				y="50"
				fontSize="12"
				fill={bodyColor}
				style={{ userSelect: "none" }}
			>
				!Q
			</text>

			<circle
				cx="95"
				cy="50"
				r="5"
				fill="white"
				stroke={bodyColor}
				strokeWidth="1.5"
			/>
		</svg>
	);
};

export default DFlipFlop;
