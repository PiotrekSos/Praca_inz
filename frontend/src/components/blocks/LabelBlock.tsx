import React, { useState } from "react";
import { ResizableBox, type ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";

type Props = {
	text?: string;
	width: number;
	height: number;
	onChange: (newText: string) => void;
	onResize: (width: number, height: number) => void;
	isSelected?: boolean; // Nowy prop
};

const LabelBlock: React.FC<Props> = ({
	text = "OPIS",
	width,
	height,
	onChange,
	onResize,
	isSelected = false, // Domyślnie fałsz
}) => {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(text);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const CustomHandle = React.forwardRef<HTMLDivElement, any>((props, ref) => {
		const { handleAxis, ...restProps } = props;

		// KLUCZOWA ZMIANA: Jeśli nie zaznaczony, nie renderujemy uchwytu
		if (!isSelected) return null;

		return (
			<div
				ref={ref}
				className={`custom-resize-handle ${handleAxis}`}
				style={{
					position: "absolute",
					bottom: 0,
					right: 0,
					width: 20,
					height: 20,
					cursor: "se-resize",
					zIndex: 100,
					background:
						"linear-gradient(135deg, transparent 50%, #666 50%)",
					opacity: 0.6,
					borderBottomRightRadius: 4,
				}}
				{...restProps}
				onMouseDown={(e) => {
					e.stopPropagation();
					if (restProps.onMouseDown) {
						restProps.onMouseDown(e);
					}
				}}
			/>
		);
	});

	return (
		<ResizableBox
			width={width}
			height={height}
			onResizeStop={(
				_e: React.SyntheticEvent,
				data: ResizeCallbackData
			) => {
				onResize(data.size.width, data.size.height);
			}}
			onResizeStart={(e) => {
				e.stopPropagation();
			}}
			minConstraints={[50, 30]}
			maxConstraints={[800, 600]}
			axis="both"
			// Zawsze przekazujemy komponent, ale on sam zdecyduje czy się wyświetlić (powyżej)
			handle={<CustomHandle />}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<div
				onDoubleClick={(e) => {
					e.stopPropagation();
					setEditing(true);
				}}
				onMouseDown={(e) => {
					if (editing) e.stopPropagation();
				}}
				style={{
					width: "100%",
					height: "100%",
					padding: "8px",
					borderRadius: 4,

					background: "rgba(255, 255, 255, 1)",
					border: isSelected
						? "1px dashed #666"
						: "1px solid transparent",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					cursor: editing ? "text" : "move",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					userSelect: "none",
					fontFamily: "Segoe UI, sans-serif",
					fontSize: 16,
					color: "#333",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{editing ? (
					<textarea
						autoFocus
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onBlur={() => {
							setEditing(false);
							onChange(value || "");
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && e.ctrlKey) {
								setEditing(false);
								onChange(value || "");
							}
						}}
						onKeyUp={(e) => e.stopPropagation()}
						onMouseDown={(e) => e.stopPropagation()}
						style={{
							width: "100%",
							height: "100%",
							border: "none",
							outline: "none",
							background: "transparent",
							resize: "none",
							textAlign: "center",
							fontFamily: "inherit",
							fontSize: "inherit",
						}}
					/>
				) : (
					<div
						style={{
							pointerEvents: "none",
							whiteSpace: "pre-wrap",
							textAlign: "center",
							width: "100%",
							wordBreak: "break-word",
						}}
					>
						{text || "Dwuklik aby edytować"}
					</div>
				)}
			</div>
		</ResizableBox>
	);
};

export default LabelBlock;
