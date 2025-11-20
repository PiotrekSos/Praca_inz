import React, { useState } from "react";

type Props = {
	text?: string;
	onChange: (newText: string) => void;
};

const LabelBlock: React.FC<Props> = ({ text = "ETYKIETA", onChange }) => {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(text);

	return (
		<div
			onDoubleClick={() => setEditing(true)}
			style={{
				minWidth: 50,
				padding: "4px 8px",
				borderRadius: 6,
				background: "rgba(255,255,255,0.7)",
				border: "1px dashed #aaa",
				cursor: "text",
				textAlign: "center",
				userSelect: "none",
				fontFamily: "monospace",
				fontSize: 14,
				color: "#333",
			}}
		>
			{editing ? (
				<input
					autoFocus
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={() => {
						setEditing(false);
						onChange(value);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							setEditing(false);
							onChange(value);
						}
					}}
					style={{
						width: "100%",
						border: "none",
						outline: "none",
						background: "transparent",
						textAlign: "center",
					}}
				/>
			) : (
				value
			)}
		</div>
	);
};

export default LabelBlock;
