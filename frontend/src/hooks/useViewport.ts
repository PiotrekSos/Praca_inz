import { useState, useCallback } from "react";

interface ViewportState {
	x: number;
	y: number;
	scale: number;
}

export const useViewport = () => {
	const [viewport, setViewport] = useState<ViewportState>({
		x: 0,
		y: 0,
		scale: 1,
	});
	const [isPanning, setIsPanning] = useState(false);

	// Obsługa przybliżania (Zoom)
	const handleWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault();
			const scaleFactor = -e.deltaY * 0.001;
			const newScale = Math.min(
				Math.max(viewport.scale + scaleFactor, 0.2),
				5
			);

			const rect = e.currentTarget.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const worldX = (mouseX - viewport.x) / viewport.scale;
			const worldY = (mouseY - viewport.y) / viewport.scale;

			const newX = mouseX - worldX * newScale;
			const newY = mouseY - worldY * newScale;

			setViewport({ x: newX, y: newY, scale: newScale });
		},
		[viewport]
	);

	// Obsługa przesuwania (Pan) - Start
	const startPanning = useCallback((e: React.MouseEvent) => {
		if (e.button === 2) {
			// Prawy przycisk myszy
			e.preventDefault();
			setIsPanning(true);
			return true; // Zwracamy true, żeby wiedzieć, że panowanie się zaczęło
		}
		return false;
	}, []);

	// Obsługa przesuwania - Ruch
	const pan = useCallback(
		(e: React.MouseEvent) => {
			if (isPanning) {
				setViewport((prev) => ({
					...prev,
					x: prev.x + e.movementX,
					y: prev.y + e.movementY,
				}));
			}
		},
		[isPanning]
	);

	// Obsługa przesuwania - Stop
	const stopPanning = useCallback(() => {
		setIsPanning(false);
	}, []);

	return {
		viewport,
		setViewport,
		isPanning,
		handlers: {
			onWheel: handleWheel,
			onMouseDown: startPanning,
			onMouseMove: pan,
			onMouseUp: stopPanning,
			onMouseLeave: stopPanning,
			onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
		},
	};
};
