import React, { useState, useEffect, useRef } from "react";
import type { Connection } from "../types";

interface EditableWireProps {
	connection: Connection & { points?: { x: number; y: number }[] };
	from: { x: number; y: number };
	to: { x: number; y: number };
	isHigh: boolean;
	onChange: (newPoints: { x: number; y: number }[]) => void;
	isSelected: boolean;
	onSelect: () => void;
	scale: number;
	showColors: boolean;
}

const EditableWire: React.FC<EditableWireProps> = ({
	connection,
	from,
	to,
	isHigh,
	onChange,
	isSelected,
	onSelect,
	scale,
	showColors,
}: {
	connection: Connection & { points?: { x: number; y: number }[] };
	from: { x: number; y: number };
	to: { x: number; y: number };
	isHigh: boolean;
	onChange: (newPoints: { x: number; y: number }[]) => void;
	isSelected: boolean;
	onSelect: () => void;
	scale: number;
	showColors: boolean;
}) => {
	const fromRef = useRef(from);
	const toRef = useRef(to);
	const onChangeRef = useRef(onChange);

	useEffect(() => {
		fromRef.current = from;
		toRef.current = to;
		onChangeRef.current = onChange;
	}, [from, to, onChange]);

	type Point = { x: number; y: number };

	const generateDefaultPoints = (f: Point, t: Point) => [
		{ x: Math.round((f.x + t.x) / 2), y: f.y },
		{ x: Math.round((f.x + t.x) / 2), y: t.y },
	];

	const [localPoints, setLocalPoints] = useState(
		connection.points?.length
			? connection.points.slice()
			: generateDefaultPoints(from, to)
	);
	const pointsRef = useRef(localPoints.slice());
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		const pts = pointsRef.current.slice();
		if (!pts.length) return;
		const f = fromRef.current;
		const t = toRef.current;

		if (pts.length >= 1) {
			const first = pts[0];
			const verticalFirst =
				Math.abs(first.x - f.x) < Math.abs(first.y - f.y);
			if (verticalFirst) {
				first.x = f.x;
				if (pts.length >= 2) pts[1].y = first.y;
			} else {
				first.y = f.y;
				if (pts.length >= 2) pts[1].x = first.x;
			}
		}

		if (pts.length >= 1) {
			const lastIdx = pts.length - 1;
			const last = pts[lastIdx];
			const verticalLast =
				Math.abs(t.x - last.x) < Math.abs(t.y - last.y);
			if (verticalLast) {
				last.x = t.x;
				if (pts.length >= 2) pts[lastIdx - 1].y = last.y;
			} else {
				last.y = t.y;
				if (pts.length >= 2) pts[lastIdx - 1].x = last.x;
			}
		}
		pointsRef.current = pts;
		setLocalPoints(pts.slice());
		onChangeRef.current(pts.slice());
	}, [from.x, from.y, to.x, to.y]);

	const mergeCollinearPoints = (pts: { x: number; y: number }[]) => {
		if (pts.length < 2) return pts;
		const full = [fromRef.current, ...pts, toRef.current];
		const simplified = [full[0]];
		for (let i = 1; i < full.length - 1; i++) {
			const prev = simplified[simplified.length - 1];
			const curr = full[i];
			const next = full[i + 1];
			if (
				(prev.x === curr.x && curr.x === next.x) ||
				(prev.y === curr.y && curr.y === next.y)
			)
				continue;
			else simplified.push(curr);
		}
		simplified.push(full[full.length - 1]);
		return simplified.slice(1, -1);
	};

	const getFull = () => [
		fromRef.current,
		...pointsRef.current,
		toRef.current,
	];

	const computeMidpoints = () => {
		const full = getFull();
		const mids = [];
		for (let i = 0; i < full.length - 1; i++) {
			const a = full[i];
			const b = full[i + 1];
			mids.push({
				x: (a.x + b.x) / 2,
				y: (a.y + b.y) / 2,
				segmentIndex: i,
				isVertical: Math.abs(a.x - b.x) < Math.abs(a.y - b.y),
			});
		}
		return mids;
	};

	const insertPointAtSegment = (segIdx: number) => {
		const pts = pointsRef.current.slice();
		const full = [fromRef.current, ...pts, toRef.current];
		const a = full[segIdx];
		const b = full[segIdx + 1];
		const newPt = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
		if (a.x === b.x) newPt.x = a.x;
		else if (a.y === b.y) newPt.y = a.y;
		pts.splice(segIdx, 0, newPt);
		const merged = mergeCollinearPoints(pts);
		pointsRef.current = merged;
		setLocalPoints(merged.slice());
		onChange(merged.slice());
	};

	const getMovedPoint = (
		p: Point,
		isVertical: boolean,
		dx: number,
		dy: number
	) =>
		isVertical
			? { x: p.x + dx / scale, y: p.y }
			: { x: p.x, y: p.y + dy / scale };

	type MidPointInfo = {
		x: number;
		y: number;
		segmentIndex: number;
		isVertical: boolean;
	};

	const handleMidMouseDown =
		(m: MidPointInfo) =>
		(e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
			e.stopPropagation();
			const startClientX = e.clientX;
			const startClientY = e.clientY;
			const startPts = pointsRef.current.map((p) => ({ ...p }));
			const seg = m.segmentIndex;

			const push = (pts: Point[]) => {
				const merged = mergeCollinearPoints(pts);
				pointsRef.current = merged;
				setLocalPoints(merged.slice());
				onChange(merged.slice());
			};

			const move = (ev: MouseEvent) => {
				const dx = ev.clientX - startClientX;
				const dy = ev.clientY - startClientY;
				let newPts = startPts.map((p) => ({ ...p }));

				if (seg === 0) {
					const from = fromRef.current;
					const first =
						newPts.length > 0
							? newPts[0]
							: generateDefaultPoints(from, toRef.current)[0];
					const moved = getMovedPoint(first, m.isVertical, dx, dy);
					const vertical =
						Math.abs(from.x - moved.x) < Math.abs(from.y - moved.y);
					const corner = vertical
						? { x: moved.x, y: from.y }
						: { x: from.x, y: moved.y };
					newPts = [corner, moved, ...newPts.slice(1)];
				} else if (seg > 0 && seg < startPts.length) {
					const p_start_idx = seg - 1;
					const p_end_idx = seg;
					newPts[p_start_idx] = getMovedPoint(
						startPts[p_start_idx],
						m.isVertical,
						dx,
						dy
					);
					newPts[p_end_idx] = getMovedPoint(
						startPts[p_end_idx],
						m.isVertical,
						dx,
						dy
					);
				} else if (seg === startPts.length) {
					const to = toRef.current;
					const last = newPts[newPts.length - 1];
					const moved = getMovedPoint(last, m.isVertical, dx, dy);
					const vertical =
						Math.abs(to.x - moved.x) < Math.abs(to.y - moved.y);
					const corner = vertical
						? { x: moved.x, y: to.y }
						: { x: to.x, y: moved.y };
					newPts = [...newPts.slice(0, -1), moved, corner];
				}
				if (newPts.length >= 2) {
					const first = newPts[0];
					const second = newPts[1];
					if (first.x !== second.x && first.y !== second.y)
						newPts[1] = { x: first.x, y: second.y };
					const last = newPts[newPts.length - 1];
					const prev = newPts[newPts.length - 2];
					if (last.x !== prev.x && last.y !== prev.y)
						newPts[newPts.length - 2] = { x: prev.x, y: last.y };
				}
				push(newPts);
			};

			const up = () => {
				window.removeEventListener("mousemove", move);
				window.removeEventListener("mouseup", up);
			};
			window.addEventListener("mousemove", move);
			window.addEventListener("mouseup", up);
		};

	const full = [fromRef.current, ...localPoints, toRef.current];
	const pathData = full
		.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
		.join(" ");
	const midpoints = computeMidpoints();
	const strokeColor = isSelected
		? "#ff3333"
		: showColors
		? isHigh
			? "green"
			: "#1976d2"
		: "black";
	const strokeWidth = isSelected ? 4 : 3;

	return (
		<g
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<path
				d={pathData}
				stroke="transparent"
				strokeWidth={20}
				fill="none"
				style={{ cursor: "pointer", pointerEvents: "stroke" }}
				onMouseDown={(e) => {
					e.stopPropagation();
					onSelect();
				}}
				onClick={(e) => {
					e.stopPropagation();
					const svg = e.currentTarget.closest("svg");
					if (!svg) return;
					const CTM = svg.getScreenCTM();
					if (!CTM) return;
					const pt = svg.createSVGPoint();
					pt.x = e.clientX;
					pt.y = e.clientY;
					const svgPoint = pt.matrixTransform(CTM.inverse());
					const cx = svgPoint.x;
					const cy = svgPoint.y;
					let best = Infinity;
					let idx = -1;
					for (let i = 0; i < midpoints.length; i++) {
						const d = Math.hypot(
							midpoints[i].x - cx,
							midpoints[i].y - cy
						);
						if (d < best) {
							best = d;
							idx = i;
						}
					}
					if (idx >= 0 && best < 40) insertPointAtSegment(idx);
				}}
			/>
			<path
				d={pathData}
				stroke={strokeColor}
				strokeWidth={strokeWidth}
				fill="none"
				style={{ pointerEvents: "none", transition: "stroke 0.2s" }}
			/>
			{isHovered &&
				midpoints.map((m, i) => (
					<circle
						key={i}
						cx={m.x}
						cy={m.y}
						r={6}
						fill="orange"
						stroke="#333"
						style={{
							cursor: m.isVertical ? "ew-resize" : "ns-resize",
							pointerEvents: "all",
						}}
						onMouseDown={handleMidMouseDown(m)}
					/>
				))}
		</g>
	);
};

export default EditableWire;
