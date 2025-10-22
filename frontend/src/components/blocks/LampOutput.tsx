import React from "react";

type Props = {
	isOn?: boolean;
};

const LampOutput: React.FC<Props> = ({ isOn = false }) => (
	<svg width="100" height="60">
		<circle
			cx="50"
			cy="30"
			r="20"
			fill={isOn ? "yellow" : "white"}
			stroke="#1976d2"
			strokeWidth="2"
		/>
		<circle
			cx="50"
			cy="30"
			r="10"
			fill="#f8f8f8"
			stroke="#1976d2"
			strokeWidth="1.5"
		/>
	</svg>
);

export default LampOutput;
