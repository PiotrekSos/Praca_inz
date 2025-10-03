import React from "react";

export default function Toolbox({
	onAdd,
}: {
	onAdd: (type: "NOR" | "NAND") => void;
}) {
	return (
		<div
			style={{
				width: 140,
				background: "#eeeeee",
				borderRight: "2px solid #ccc",
				padding: 8,
			}}
		>
			<h4>Toolbox</h4>
			<button
				onClick={() => onAdd("NOR")}
				style={{ display: "block", width: "100%", marginTop: 8 }}
			>
				Add NOR
			</button>
			<button
				onClick={() => onAdd("NAND")}
				style={{ display: "block", width: "100%", marginTop: 8 }}
			>
				Add NAND
			</button>
		</div>
	);
}
