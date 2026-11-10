import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { skillGroups, type SkillGroup } from "#/data/skills";
import { useLiveContent } from "#/lib/useLiveContent";
import { useSceneSection } from "./scene/SceneContext";
import { Container, Glow, Reveal, SectionLabel } from "./ui";

interface TechnologyRow {
	category: string;
	items: string[];
}

const RADIUS = 196;

/** Even distribution on a sphere (golden-angle spiral). */
function spherePoints(count: number) {
	return Array.from({ length: count }, (_, index) => {
		const offset = 2 / count;
		const y = index * offset - 1 + offset / 2;
		const r = Math.sqrt(Math.max(0, 1 - y * y));
		const phi = index * Math.PI * (3 - Math.sqrt(5));
		return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
	});
}

export default function SkillsSphere() {
	const sectionRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const nodesRef = useRef<(HTMLSpanElement | null)[]>([]);
	const rotation = useRef({ x: -0.15, y: 0.2 });
	const drag = useRef({ active: false, x: 0, y: 0 });
	const reduced = useReducedMotion();

	const { items } = useLiveContent<TechnologyRow>("technologies");
	const groups: SkillGroup[] = useMemo(
		() =>
			items.length > 0
				? items.map((row) => ({ label: row.category, items: row.items }))
				: skillGroups,
		[items],
	);

	const tags = useMemo(
		() => Array.from(new Set(groups.flatMap((group) => group.items))),
		[groups],
	);
	const points = useMemo(() => spherePoints(tags.length), [tags.length]);
	const tagKey = tags.join("|");

	useSceneSection(sectionRef, "skills", "#a78bfa");

	const draw = useCallback(() => {
		const { x: rotX, y: rotY } = rotation.current;
		const cosY = Math.cos(rotY);
		const sinY = Math.sin(rotY);
		const cosX = Math.cos(rotX);
		const sinX = Math.sin(rotX);

		nodesRef.current.forEach((node, index) => {
			const point = points[index];
			if (!node || !point) return;

			// Rotate around Y, then X. Positions stay axis-aligned so the labels
			// never render mirrored; depth is expressed through perspective.
			const x1 = point.x * cosY + point.z * sinY;
			const z1 = -point.x * sinY + point.z * cosY;
			const y2 = point.y * cosX - z1 * sinX;
			const z2 = point.y * sinX + z1 * cosX;

			node.style.transform = `translate3d(${(x1 * RADIUS).toFixed(2)}px, ${(y2 * RADIUS).toFixed(2)}px, ${(z2 * RADIUS).toFixed(2)}px) translate(-50%, -50%)`;
			node.style.opacity = String(0.3 + 0.7 * ((z2 + 1) / 2));
		});
	}, [points]);

	useEffect(() => {
		if (reduced) {
			draw();
			return;
		}

		let frame = 0;
		let last = performance.now();

		const tick = (now: number) => {
			const delta = Math.min(0.05, (now - last) / 1000);
			last = now;
			if (!drag.current.active) {
				rotation.current.y += delta * 0.18;
				rotation.current.x += Math.sin(now / 5200) * delta * 0.05;
			}
			draw();
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [draw, reduced, tagKey]);

	return (
		<section
			ref={sectionRef}
			id="skills"
			aria-labelledby="skills-heading"
			className="relative overflow-hidden py-24 sm:py-32"
		>
			<Glow className="left-1/3 top-10 size-[32rem] opacity-50" color="rgba(167,139,250,0.2)" />

			<Container>
				<div className="grid grid-cols-12 items-center gap-y-12 lg:gap-x-12">
					<div className="col-span-12 lg:col-span-4">
						<SectionLabel>Toolkit</SectionLabel>
						<h2
							id="skills-heading"
							className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl"
						>
							<Reveal>Tools I reach</Reveal>
							<Reveal delay={0.08}>
								<span className="immersive-gradient-text">for by default.</span>
							</Reveal>
						</h2>
						<p className="mt-6 max-w-sm text-sm leading-relaxed text-[var(--i-muted)]">
							A working set, not a wish list. Grouped by the problems they solve.
						</p>
					</div>

					<div className="col-span-12 lg:col-span-8">
						<div
							className="relative hidden h-[520px] items-center justify-center lg:flex"
							aria-hidden
						>
							<div
								ref={stageRef}
								className="relative size-[480px] cursor-grab select-none active:cursor-grabbing [perspective:1000px]"
								onPointerDown={(event) => {
									drag.current = {
										active: true,
										x: event.clientX,
										y: event.clientY,
									};
									event.currentTarget.setPointerCapture(event.pointerId);
								}}
								onPointerMove={(event) => {
									if (!drag.current.active) return;
									rotation.current.y += (event.clientX - drag.current.x) * 0.006;
									rotation.current.x -= (event.clientY - drag.current.y) * 0.006;
									rotation.current.x = Math.max(
										-1.1,
										Math.min(1.1, rotation.current.x),
									);
									drag.current.x = event.clientX;
									drag.current.y = event.clientY;
									if (reduced) draw();
								}}
								onPointerUp={() => {
									drag.current.active = false;
								}}
								onPointerCancel={() => {
									drag.current.active = false;
								}}
								style={{ touchAction: "none" }}
							>
								<span className="pointer-events-none absolute inset-16 rounded-full border border-[var(--i-line)]" />
								<span className="pointer-events-none absolute inset-28 rounded-full border border-dashed border-[var(--i-line)]" />
								<div className="absolute inset-0 [transform-style:preserve-3d]">
									{tags.map((tag, index) => (
										<span
											key={tag}
											ref={(node) => {
												nodesRef.current[index] = node;
											}}
											className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-[var(--i-line)] bg-[var(--i-bg)]/70 px-3 py-1.5 font-mono text-[11px] tracking-wide text-[var(--i-muted)] backdrop-blur-sm will-change-transform"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							<motion.p
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.6 }}
								className="mono-label absolute bottom-2 left-1/2 -translate-x-1/2 text-[var(--i-subtle)]"
							>
								Drag to rotate
							</motion.p>
						</div>

						{/* Grouped list: the only view on mobile, screen-reader copy on desktop. */}
						<ul className="grid gap-6 sm:grid-cols-2 lg:sr-only">
							{groups.map((group) => (
								<li key={group.label}>
									<p className="mono-label text-[#6ee7b7]">{group.label}</p>
									<ul className="mt-3 flex flex-wrap gap-1.5">
										{group.items.map((item) => (
											<li
												key={item}
												className="rounded-full border border-[var(--i-line)] bg-[var(--i-card)] px-3 py-1.5 text-xs text-[var(--i-muted)]"
											>
												{item}
											</li>
										))}
									</ul>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Container>
		</section>
	);
}
