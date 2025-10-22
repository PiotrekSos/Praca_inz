import React, { useEffect, useState } from "react";

type Props = {
	onChange?: (value: number) => void;
};

const ClockInput: React.FC<Props> = ({ onChange }) => {
	const [on, setOn] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setOn((prev) => {
				const newValue = !prev;
				onChange?.(newValue ? 1 : 0);
				return newValue;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [onChange]);

	return (
		<svg width="100" height="60">
			<rect
				x="20"
				y="10"
				width="60"
				height="40"
				fill={on ? "#1976d2" : "white"}
				stroke="#1976d2"
				strokeWidth="2"
				rx="6"
			/>
			<path
				d="M35,40 V30 H35 V40 H50 V25 H65 V35"
				stroke={on ? "white" : "#1976d2"}
				strokeWidth="2"
				fill="none"
			/>
		</svg>
	);
};

export default ClockInput;
