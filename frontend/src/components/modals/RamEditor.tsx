import React, { useState, useEffect } from "react";
import type { Block } from "../../types";
import { Save } from "lucide-react";

interface RamEditorProps {
	block: Block;
	onClose: () => void;
	onSave: (blockId: number, newMemory: Uint8Array) => void;
}

export const RamEditor: React.FC<RamEditorProps> = ({
	block,
	onClose,
	onSave,
}) => {
	const [localMemory, setLocalMemory] = useState<Uint8Array>(
		new Uint8Array(16)
	);

	useEffect(() => {
		if (block.memory) {
			setLocalMemory(new Uint8Array(block.memory));
		}
	}, [block.memory]);

	const toggleBit = (addressIndex: number, bitPosition: number) => {
		const newMem = new Uint8Array(localMemory);
		newMem[addressIndex] ^= 1 << bitPosition;
		setLocalMemory(newMem);
	};

	const handleSave = () => {
		onSave(block.id, localMemory);
		onClose();
	};

	const getAddrBit = (val: number, bit: number) => (val >> bit) & 1;
	const getDataBit = (val: number, bit: number) => (val >> bit) & 1;

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-white rounded-lg shadow-2xl w-[600px] flex flex-col border border-gray-400 overflow-hidden font-sans">
				{/* Header */}

				{/* Content */}
				<div className="flex-1 overflow-auto p-0 bg-white max-h-[65vh]">
					<table className="ram-table">
						<thead>
							{/* Główny nagłówek */}
							<tr>
								<th colSpan={4} className="main-header addr-bg">
									ADRES (A)
								</th>
								<th colSpan={4} className="main-header data-bg">
									DANE (D)
								</th>
							</tr>
							{/* Nagłówek bitów */}
							<tr className="sub-header">
								<th>A3</th>
								<th>A2</th>
								<th>A1</th>
								<th>A0</th>
								<th>D3</th>
								<th>D2</th>
								<th>D1</th>
								<th>D0</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 16 }).map((_, addrIdx) => (
								<tr key={addrIdx}>
									{/* Adresy (szare tło, read-only) */}
									<td className="addr-cell">
										{getAddrBit(addrIdx, 3)}
									</td>
									<td className="addr-cell">
										{getAddrBit(addrIdx, 2)}
									</td>
									<td className="addr-cell">
										{getAddrBit(addrIdx, 1)}
									</td>
									<td className="addr-cell">
										{getAddrBit(addrIdx, 0)}
									</td>

									{/* Dane (klikalne kratki) */}
									{[3, 2, 1, 0].map((bitPos) => {
										const isSet =
											getDataBit(
												localMemory[addrIdx],
												bitPos
											) === 1;
										return (
											<td
												key={bitPos}
												className="data-cell"
												onClick={() =>
													toggleBit(addrIdx, bitPos)
												}
											>
												<div
													className={`bit-box ${
														isSet ? "active" : ""
													}`}
												>
													{isSet ? "1" : "0"}
												</div>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="modal-footer">
					<button
						onClick={onClose}
						className="btn-base btn-secondary"
					>
						Anuluj
					</button>
					<button
						onClick={handleSave}
						className="btn-base btn-primary"
					>
						<Save size={24} />
						Zapisz zmiany
					</button>
				</div>
			</div>

			{/* Style CSS */}
			<style>{`
        .ram-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
        }

        .ram-table th, 
        .ram-table td {
          border: 1px solid #e5e7eb;
          text-align: center;
          vertical-align: middle;
        }

        /* Nagłówki */
        .main-header {
          font-family: sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          padding: 10px;
          border-bottom: 2px solid #d1d5db;
        }
        .addr-bg { background-color: #f1f5f9; color: #475569; }
        .data-bg { background-color: #f0fdf4; color: #166534; }
        
        .sub-header th {
          background-color: #f9fafb;
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          padding: 8px 0;
          border-bottom: 2px solid #e5e7eb;
        }

        /* Komórki */
        .addr-cell {
          background-color: #f8fafc;
          color: #94a3b8;
          font-weight: bold;
          width: 20px; /* Stała szerokość dla adresów */
        }

        .data-cell {
          cursor: pointer;
          background-color: #fff;
          transition: background-color 0.1s;
          width: 20px; /* Stała szerokość dla danych */
        }
        .data-cell:hover {
          background-color: #f0fdf4;
        }

        /* Guziki (Bit Box) */
        .bit-box {
          width: 24px;
          height: 24px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 2px solid #e2e8f0;
          background-color: #fff;
          color: #cbd5e1;
          font-weight: bold;
          font-size: 12px;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .bit-box:hover {
          border-color: #94a3b8;
          color: #64748b;
        }

        /* Aktywny stan (1) */
        .bit-box.active {
          background-color: #22c55e;
          border-color: #16a34a;
          color: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          transform: translateY(0);
        }
		/* --- FOOTER STYLES --- */
        .modal-footer {
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
        }

        /* Bazowy styl przycisku */
        .btn-base {
          height: 40px; /* Sztywna wysokość */
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          gap: 8px;
        }

        /* Styl Anuluj */
        .btn-secondary {
          flex: 1; /* Zajmuje dostępną przestrzeń */
          background-color: white;
          border-color: #d1d5db;
          color: #374151;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-secondary:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        /* Styl Zapisz */
        .btn-primary {
          flex: 1; /* Zajmuje dostępną przestrzeń */
          background-color: #2563eb;
          color: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .btn-primary:hover {
          background-color: #1d4ed8;
        }      
      `}</style>
		</div>
	);
};
