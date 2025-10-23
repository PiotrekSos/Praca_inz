type Props = {
	value?: number;
};

const ClockInput: React.FC<Props> = ({ value = 0 }) => {
	return (
		<svg width="100" height="60">
			<rect
				x="20"
				y="10"
				width="60"
				height="40"
				fill="white"
				stroke="#1976d2"
				strokeWidth="2"
				rx="6"
			/>
			<path
				d="M30,40 V25 H50 V40 H70 V25"
				stroke={value ? "green" : "#1976d2"}
				strokeWidth="3"
				fill="none"
			/>
		</svg>
	);
};

export default ClockInput;
