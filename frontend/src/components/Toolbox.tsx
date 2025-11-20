import { useState, useRef, useEffect } from "react";
import {
	ChevronDown,
	ChevronRight,
	ChevronLeft,
	Save,
	FolderOpen,
	Camera,
	Play, // --- NOWE ---
	Pause, // --- NOWE ---
	RotateCcw, // --- NOWE ---
} from "lucide-react";
// ... (reszta importów bez zmian)
import AndGate from "./gates/AndGate";
import OrGate from "./gates/OrGate";
import NotGate from "./gates/NotGate";
import BufferGate from "./gates/BufferGate";
import XorGate from "./gates/XorGate";
import XnorGate from "./gates/XnorGate";
import NandGate from "./gates/NandGate";
import NorGate from "./gates/NorGate";
import ClockInput from "./blocks/ClockInput";
import ConstOne from "./blocks/ConstOne";
import ConstZero from "./blocks/ConstZero";
import ToggleSwitch from "./blocks/ToggleSwitch";
import LampOutput from "./blocks/LampOutput";
import DFlipFlop from "./gates/DFlipFlop";
import TFlipFlop from "./gates/TFlipFlop";
import JKFlipFlop from "./gates/JKFlipFlop";
import SRFlipFlop from "./gates/SRFlipFlop";
import NorGate4 from "./gates/NorGate4";
import NorGate8 from "./gates/NorGate8";
import NandGate4 from "./gates/NandGate4";
import NandGate8 from "./gates/NandGate8";
import Mux16 from "./gates/Mux16";
import Demux16 from "./gates/Demux16";
import Mux4 from "./gates/Mux4";
import Demux4 from "./gates/Demux4";
import Ram16x4 from "./blocks/Ram16x4";

// ... (categories i ScaledPreview bez zmian) ...
const categories = [
	// ... (skopiuj kategorie z poprzedniej wersji, są długie) ...
	{
		name: "Wejścia",
		items: [
			{ type: "CLOCK", label: "CLOCK", component: <ClockInput /> },
			{ type: "ONE", label: "1", component: <ConstOne /> },
			{ type: "ZERO", label: "0", component: <ConstZero /> },
			{ type: "TOGGLE", label: "TOGGLE", component: <ToggleSwitch /> },
			{
				type: "LABEL",
				label: "LABEL",
				component: (
					<div
						style={{
							fontFamily: "monospace",
							fontSize: 18,
							padding: "2px 6px",
						}}
					>
						Label
					</div>
				),
			},
		],
	},
	{
		name: "Wyjścia",
		items: [{ type: "LAMP", label: "LAMP", component: <LampOutput /> }],
	},
	{
		name: "Bramki 2-wejściowe",
		items: [
			{ type: "AND", label: "AND", component: <AndGate /> },
			{ type: "OR", label: "OR", component: <OrGate /> },
			{ type: "NOT", label: "NOT", component: <NotGate /> },
			{ type: "BUFFER", label: "BUF", component: <BufferGate /> },
			{ type: "XOR", label: "XOR", component: <XorGate /> },
			{ type: "XNOR", label: "XNOR", component: <XnorGate /> },
			{ type: "NAND", label: "NAND", component: <NandGate /> },
			{ type: "NOR", label: "NOR", component: <NorGate /> },
		],
	},
	{
		name: "Bramki wielowejściowe",
		items: [
			{ type: "NAND_4", label: "NAND-4", component: <NandGate4 /> },
			{ type: "NAND_8", label: "NAND-8", component: <NandGate8 /> },
			{ type: "NOR_4", label: "NOR-4", component: <NorGate4 /> },
			{ type: "NOR_8", label: "NOR-8", component: <NorGate8 /> },
		],
	},
	{
		name: "Przerzutniki",
		items: [
			{ type: "D_FLIPFLOP", label: "D-FF", component: <DFlipFlop /> },
			{ type: "T_FLIPFLOP", label: "T-FF", component: <TFlipFlop /> },
			{ type: "JK_FLIPFLOP", label: "JK-FF", component: <JKFlipFlop /> },
			{ type: "SR_FLIPFLOP", label: "SR-FF", component: <SRFlipFlop /> },
		],
	},
	{
		name: "Pamięć",
		items: [
			{ type: "RAM_16x4", label: "RAM 16x4", component: <Ram16x4 /> },
		],
	},
	{
		name: "MUX / DEMUX",
		items: [
			{ type: "MUX4", label: "MUX-4", component: <Mux4 /> },
			{ type: "DEMUX4", label: "DEMUX-4", component: <Demux4 /> },
			{ type: "MUX16", label: "MUX-16", component: <Mux16 /> },
			{ type: "DEMUX16", label: "DEMUX-16", component: <Demux16 /> },
		],
	},
];

const ScaledPreview = ({
	component,
	maxWidth,
	maxHeight,
}: {
	component: JSX.Element;
	maxWidth: number;
	maxHeight: number;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const updateScale = () => {
			if (!containerRef.current || !contentRef.current) return;
			const cBox = containerRef.current.getBoundingClientRect();
			const iBox = contentRef.current.getBoundingClientRect();
			const s = Math.min(
				cBox.width / iBox.width,
				cBox.height / iBox.height
			);
			setScale(s * 0.9);
		};
		updateScale();
		window.addEventListener("resize", updateScale);
		return () => window.removeEventListener("resize", updateScale);
	}, [component, maxWidth, maxHeight]);

	return (
		<div
			ref={containerRef}
			style={{
				width: maxWidth,
				height: maxHeight,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
			}}
		>
			<div
				ref={contentRef}
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "center center",
				}}
			>
				{component}
			</div>
		</div>
	);
};

const Toolbox = ({
	onAddGate,
	onSave,
	onLoad,
	onExport,
	// --- NOWE PROPSY ---
	isSimulationRunning,
	onToggleSimulation,
	onReset,
}: {
	onAddGate: (type: string) => void;
	onSave: () => void;
	onLoad: (data: any) => void;
	onExport: () => void;
	isSimulationRunning: boolean;
	onToggleSimulation: () => void;
	onReset: () => void;
}) => {
	const [openCategory, setOpenCategory] = useState<string | null>("Wejścia");
	const [collapsed, setCollapsed] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const toolboxWidth = 200;

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result as string;
				const data = JSON.parse(content);
				onLoad(data);
			} catch (err) {
				alert("Błąd podczas wczytywania pliku: " + err);
			}
		};
		reader.readAsText(file);
		event.target.value = "";
	};

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				height: "100%",
				display: "flex",
				zIndex: 10,
			}}
		>
			<div
				style={{
					width: toolboxWidth,
					background: "#fafafa",
					borderRight: "1px solid #ccc",
					padding: 8,
					overflowY: "auto",
					transition: "transform 0.3s ease",
					boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
					transform: collapsed
						? "translateX(-100%)"
						: "translateX(0)",
				}}
			>
				<div
					style={{
						padding: "12px",
						borderBottom: "1px solid #ddd",
						background: "#f0f0f0",
						display: "flex",
						gap: "8px",
						flexDirection: "column",
					}}
				>
					{/* --- SEKCJA SYMULACJI (NOWA) --- */}
					<button
						onClick={onToggleSimulation}
						title={
							isSimulationRunning ? "Pauza" : "Start Symulacji"
						}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 6,
							padding: "8px",
							cursor: "pointer",
							border: "1px solid #ccc",
							borderRadius: 4,
							background: isSimulationRunning
								? "#ffcccc"
								: "#ccffcc", // Czerwony jak stop, Zielony jak start
							fontWeight: "bold",
						}}
					>
						{isSimulationRunning ? (
							<Pause size={18} />
						) : (
							<Play size={18} />
						)}
						<span>{isSimulationRunning ? "Stop" : "Start"}</span>
					</button>

					{/* Reset */}
					<button
						onClick={onReset}
						title="Zresetuj układ (Stany i Pamięć)"
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 6,
							padding: "6px",
							cursor: "pointer",
							border: "1px solid #ccc",
							borderRadius: 4,
							background: "white",
							marginBottom: "4px",
						}}
					>
						<RotateCcw size={16} />
						<span style={{ fontSize: 12 }}>Reset</span>
					</button>

					<div style={{ display: "flex", gap: 4 }}>
						<button
							onClick={onSave}
							title="Zapisz"
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "6px",
								cursor: "pointer",
								border: "1px solid #ccc",
								borderRadius: 4,
								background: "white",
							}}
						>
							<Save size={16} />
						</button>
						<button
							onClick={() => fileInputRef.current?.click()}
							title="Wczytaj"
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "6px",
								cursor: "pointer",
								border: "1px solid #ccc",
								borderRadius: 4,
								background: "white",
							}}
						>
							<FolderOpen size={16} />
						</button>
						<button
							onClick={onExport}
							title="Eksportuj"
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "6px",
								cursor: "pointer",
								border: "1px solid #ccc",
								borderRadius: 4,
								background: "white",
							}}
						>
							<Camera size={16} />
						</button>
					</div>
					<input
						type="file"
						accept=".json"
						ref={fileInputRef}
						style={{ display: "none" }}
						onChange={handleFileChange}
					/>
				</div>

				{categories.map((cat) => {
					const open = openCategory === cat.name;
					return (
						<div key={cat.name}>
							<div
								onClick={() =>
									setOpenCategory(open ? null : cat.name)
								}
								style={{
									display: "flex",
									alignItems: "center",
									cursor: "pointer",
									padding: "6px 8px",
									fontWeight: 600,
									fontSize: 14,
									background: "#eee",
									marginTop: 4,
									borderRadius: 6,
								}}
							>
								{open ? (
									<ChevronDown size={16} />
								) : (
									<ChevronRight size={16} />
								)}
								<span style={{ marginLeft: 6 }}>
									{cat.name}
								</span>
							</div>
							<div
								style={{
									maxHeight: open ? 400 : 0,
									overflow: "hidden",
									transition: "max-height 0.3s ease",
								}}
							>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: 6,
										padding: 6,
										justifyContent: "space-around",
									}}
								>
									{cat.items.map(
										({ type, component, label }) => (
											<div
												key={type}
												onClick={() => onAddGate(type)}
												style={{
													border: "1px solid #aaa",
													borderRadius: 8,
													width: 70,
													height: 70,
													background: "#fff",
													boxShadow:
														"0 1px 3px rgba(0,0,0,0.15)",
													cursor: "pointer",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "center",
													transition: "0.2s",
												}}
											>
												<ScaledPreview
													component={component}
													maxWidth={60}
													maxHeight={35}
												/>
												<div
													style={{
														fontSize: 10,
														marginTop: 3,
														textAlign: "center",
														color: "#333",
													}}
												>
													{label}
												</div>
											</div>
										)
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div
				onClick={() => setCollapsed(!collapsed)}
				style={{
					position: "absolute",
					left: collapsed ? toolboxWidth - 200 : toolboxWidth + 16,
					top: 10,
					width: 24,
					height: 40,
					background: "#ddd",
					border: "1px solid #aaa",
					borderLeft: "none",
					borderRadius: "0 6px 6px 0",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
					transition: "left 0.3s ease, background 0.2s",
					zIndex: 11,
				}}
			>
				{collapsed ? (
					<ChevronRight size={18} />
				) : (
					<ChevronLeft size={18} />
				)}
			</div>
		</div>
	);
};

export default Toolbox;
