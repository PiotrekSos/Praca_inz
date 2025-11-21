import { toPng } from "html-to-image";
import { getBlockDimensions } from "./blockUtils";
import type { Block, Connection } from "../types";

export const exportToImage = async (
	blocks: Block[],
	connections: Connection[]
) => {
	if (blocks.length === 0) {
		alert("Plansza jest pusta!");
		return;
	}

	// 1. Obliczanie Bounding Box
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	blocks.forEach((b) => {
		const { w, h } = getBlockDimensions(b.type);
		if (b.x < minX) minX = b.x;
		if (b.y < minY) minY = b.y;
		if (b.x + w > maxX) maxX = b.x + w;
		if (b.y + h > maxY) maxY = b.y + h;
	});

	connections.forEach((c) => {
		if (c.points) {
			c.points.forEach((p) => {
				if (p.x < minX) minX = p.x;
				if (p.y < minY) minY = p.y;
				if (p.x > maxX) maxX = p.x;
				if (p.y > maxY) maxY = p.y;
			});
		}
	});

	const padding = 10;
	minX -= padding;
	minY -= padding;
	maxX += padding;
	maxY += padding;

	const width = maxX - minX;
	const height = maxY - minY;

	const node = document.getElementById("circuit-board");
	if (!node) return;

	try {
		const dataUrl = await toPng(node, {
			width: width,
			height: height,
			style: {
				transform: `translate(${-minX}px, ${-minY}px) scale(1)`,
				transformOrigin: "top left",
				width: "100%",
				height: "100%",
			},
			backgroundColor: "#f0f0f0",
		});

		const link = document.createElement("a");
		link.download = "uklad_logiczny.png";
		link.href = dataUrl;
		link.click();
	} catch (err) {
		console.error("Błąd eksportu:", err);
		alert("Nie udało się wygenerować zdjęcia.");
	}
};
