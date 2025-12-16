import { useState } from "react";
import Toolbox from "./components/Toolbox";
import DraggableGate from "./components/DraggableGate";
import EditableWire from "./components/EditableWire";
import type { Block, Connection, Selection, BlockType } from "./types.ts";
import { getInputPinPosition, getOutputPinPosition } from "./pinPositions";
import { exportToImage } from "./utils/exportUtils";
import { Junctions } from "./components/Junctions";

import { useUnsavedChangesWarning } from "./hooks/useUnsavedChangesWarning";
import { useFileHandler } from "./hooks/useFileHandler";
import { useViewport } from "./hooks/useViewport";
import { useCircuitActions } from "./hooks/useCircuitActions";
import { useSimulation } from "./hooks/useSimulation";

function App() {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [connections, setConnections] = useState<Connection[]>([]);
	const [selection, setSelection] = useState<Selection>(null);
	const [pending, setPending] = useState<{
		from: { blockId: number; outputIndex?: number } | null;
	}>({ from: null });
	const [showColors, setShowColors] = useState(true);
	const [circuitVersion, setCircuitVersion] = useState(0);

	const {
		viewport,
		setViewport,
		isPanning,
		handlers: viewportHandlers,
	} = useViewport();

	useUnsavedChangesWarning(blocks.length > 0);

	const { isSimulationRunning, handleReset, handleToggleSimulation } =
		useSimulation({
			blocks,
			setBlocks,
			connections,
		});

	const { handleAddBlock, handleMove, handleLabelChange, handlePinClick } =
		useCircuitActions({
			blocks,
			setBlocks,
			connections,
			setConnections,
			selection,
			setSelection,
			pending,
			setPending,
			viewport,
		});

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();

		const type = e.dataTransfer.getData("blockType") as BlockType;
		if (!type) return;

		const rect = e.currentTarget.getBoundingClientRect();

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const worldX = (mouseX - viewport.x) / viewport.scale;
		const worldY = (mouseY - viewport.y) / viewport.scale;

		handleAddBlock(type, worldX - 30, worldY - 20);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	};

	const { handleSave, handleLoad } = useFileHandler({
		blocks,
		connections,
		viewport,
		setBlocks,
		setConnections,
		setViewport,
		setCircuitVersion,
		setSelection,
		setPending,
	});

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Toolbox
				onAddGate={handleAddBlock}
				onSave={handleSave}
				onLoad={handleLoad}
				onExport={() => exportToImage(blocks, connections)}
				isSimulationRunning={isSimulationRunning}
				onToggleSimulation={handleToggleSimulation}
				onReset={handleReset}
				showColors={showColors}
				onToggleColors={() => setShowColors(!showColors)}
			/>

			<div
				style={{
					flex: 1,
					position: "relative",
					background: "#f0f0f0",
					overflow: "hidden",
					cursor: isPanning ? "grabbing" : "default",
				}}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onContextMenu={viewportHandlers.onContextMenu}
				onWheel={viewportHandlers.onWheel}
				onMouseDown={(e) => {
					const handled = viewportHandlers.onMouseDown(e);
					if (!handled && e.button === 0) {
						setSelection(null);
					}
				}}
				onMouseMove={(e) => {
					viewportHandlers.onMouseMove(e);
				}}
				onMouseUp={viewportHandlers.onMouseUp}
				onMouseLeave={viewportHandlers.onMouseLeave}
			>
				{/* --- TUTAJ JEST KLUCZOWA ZMIANA --- */}
				{/* Ten div musi obejmować wszystko co ma być na zdjęciu */}
				<div
					id="circuit-board" // <--- ID MUSI BYĆ TUTAJ (na kontenerze z transform)
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
						transformOrigin: "0 0",
						pointerEvents: "none",
					}}
				>
					{/* SVG z liniami (Wewnątrz circuit-board) */}
					<svg
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							width: "100%",
							height: "100%",
							pointerEvents: "all",
							overflow: "visible",
						}}
					>
						{connections.map((c, i) => {
							const fromBlock = blocks.find(
								(b) => b.id === c.from.blockId
							);
							const toBlock = blocks.find(
								(b) => b.id === c.to.blockId
							);
							if (!fromBlock || !toBlock) return null;

							const from = getOutputPinPosition(
								fromBlock,
								c.from.outputIndex ?? 0
							);
							const to = getInputPinPosition(
								toBlock,
								c.to.inputIndex
							) || { x: 0, y: 0 };
							const isHigh =
								fromBlock.outputs[c.from.outputIndex ?? 0] ===
								1;
							const isSelected =
								selection?.type === "connection" &&
								selection.index === i;

							const uniqueKey = `${circuitVersion}-${
								c.from.blockId
							}-${c.from.outputIndex ?? 0}-${c.to.blockId}-${
								c.to.inputIndex
							}`;

							return (
								<EditableWire
									key={uniqueKey}
									connection={c}
									from={from}
									to={to}
									isHigh={isHigh}
									isSelected={isSelected}
									scale={viewport.scale}
									onSelect={() =>
										setSelection({
											type: "connection",
											index: i,
										})
									}
									onChange={(
										newPoints: { x: number; y: number }[]
									) => {
										setConnections((prev) =>
											prev.map((conn, idx) =>
												idx === i
													? {
															...conn,
															points: newPoints,
													  }
													: conn
											)
										);
									}}
									showColors={showColors}
								/>
							);
						})}
						<Junctions
							connections={connections}
							blocks={blocks}
							showColors={showColors}
						/>
					</svg>

					{/* Bramki (Wewnątrz circuit-board) */}
					{blocks.map((b) => (
						<div
							key={`${circuitVersion}-${b.id}`}
							style={{ pointerEvents: "all" }}
						>
							{" "}
							<DraggableGate
								block={b}
								onMove={handleMove}
								onPinClick={handlePinClick}
								onLabelChange={handleLabelChange}
								isSelected={
									selection?.type === "block" &&
									selection.id === b.id
								}
								onSelect={() =>
									setSelection({ type: "block", id: b.id })
								}
								scale={viewport.scale}
								isSimulationRunning={isSimulationRunning}
								showColors={showColors}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
