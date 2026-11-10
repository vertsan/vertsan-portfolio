import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import FloatingShapes from "./FloatingShapes";
import PortraitOrbit from "./PortraitOrbit";
import PortraitParticles from "./PortraitParticles";
import type { SceneTarget } from "./SceneContext";

interface SectionAnchor {
	id: string;
	x: number;
	y: number;
	z: number;
	scale: number;
	tilt: number;
}

/**
 * Continuous section layouts.
 * As the user scrolls, the 3D portrait smoothly interpolates between these coordinates
 * in real-time, perfectly synced with scroll gestures.
 */
const SECTION_ANCHORS: SectionAnchor[] = [
	{ id: "top", x: 0.21, y: 0.02, z: 0, scale: 1.0, tilt: 0 },
	{ id: "about", x: -0.28, y: 0.04, z: -0.7, scale: 0.58, tilt: -0.22 },
	{ id: "experience", x: 0.32, y: -0.14, z: -1.3, scale: 0.32, tilt: 0.18 },
	{ id: "projects", x: 0.35, y: 0.25, z: -1.5, scale: 0.24, tilt: 0.28 },
	{ id: "skills", x: -0.32, y: 0.22, z: -1.6, scale: 0.22, tilt: -0.28 },
	{ id: "certificates", x: 0.32, y: -0.25, z: -1.6, scale: 0.22, tilt: 0.24 },
	{ id: "contact", x: 0.0, y: 0.26, z: -1.1, scale: 0.36, tilt: 0 },
];

export default function SceneRig({
	target,
	reduced,
	dark,
	particleCount,
	children,
}: {
	target: SceneTarget;
	reduced: boolean;
	dark: boolean;
	particleCount: number;
	children?: React.ReactNode;
}) {
	const group = useRef<THREE.Group>(null);
	const { viewport, size } = useThree();
	const sectionTops = useRef<number[]>([]);

	const updateTops = useCallback(() => {
		const scrollY = window.scrollY;
		sectionTops.current = SECTION_ANCHORS.map((sec) => {
			const el = document.getElementById(sec.id);
			if (!el) return 0;
			return el.getBoundingClientRect().top + scrollY;
		});
	}, []);

	useEffect(() => {
		updateTops();
		window.addEventListener("resize", updateTops);
		const timer = setInterval(updateTops, 1200);
		return () => {
			window.removeEventListener("resize", updateTops);
			clearInterval(timer);
		};
	}, [updateTops]);

	useFrame((state, delta) => {
		const node = group.current;
		if (!node) return;

		const tops = sectionTops.current;
		const scrollY = window.scrollY;
		const viewportH = window.innerHeight;
		const scrollCenter = scrollY + viewportH * 0.38;
		const mobile = size.width < 768;

		const interp = { ...SECTION_ANCHORS[0] };

		if (tops.length === SECTION_ANCHORS.length) {
			let activeIdx = 0;
			for (let i = 0; i < tops.length - 1; i++) {
				if (scrollCenter >= tops[i]) {
					activeIdx = i;
				}
			}

			if (activeIdx < tops.length - 1) {
				const topA = tops[activeIdx];
				const topB = tops[activeIdx + 1];
				const span = Math.max(1, topB - topA);
				const rawT = Math.min(1, Math.max(0, (scrollCenter - topA) / span));
				// Smoothstep for natural ease between sections
				const t = rawT * rawT * (3 - 2 * rawT);

				const a = SECTION_ANCHORS[activeIdx];
				const b = SECTION_ANCHORS[activeIdx + 1];

				interp.x = THREE.MathUtils.lerp(a.x, b.x, t);
				interp.y = THREE.MathUtils.lerp(a.y, b.y, t);
				interp.z = THREE.MathUtils.lerp(a.z, b.z, t);
				interp.scale = THREE.MathUtils.lerp(a.scale, b.scale, t);
				interp.tilt = THREE.MathUtils.lerp(a.tilt, b.tilt, t);
			} else {
				const last = SECTION_ANCHORS[SECTION_ANCHORS.length - 1];
				interp.x = last.x;
				interp.y = last.y;
				interp.z = last.z;
				interp.scale = last.scale;
				interp.tilt = last.tilt;
			}
		}

		if (mobile) {
			const heroProgress = Math.min(1, Math.max(0, scrollY / (viewportH * 0.75)));
			interp.x = THREE.MathUtils.lerp(0, interp.x * 0.35, heroProgress);
			interp.y = THREE.MathUtils.lerp(-0.28, interp.y * 0.55, heroProgress);
			interp.z = THREE.MathUtils.lerp(-0.5, -1.8, heroProgress);
			interp.scale = THREE.MathUtils.lerp(0.58, 0.22, heroProgress);
		}

		const scaleBase = THREE.MathUtils.clamp(viewport.width / 7.6, 0.42, 1);
		const targetX = viewport.width * interp.x;
		const targetY = viewport.height * interp.y;
		const targetScale = interp.scale * scaleBase;

		const damp = (current: number, next: number, lambda: number) =>
			THREE.MathUtils.damp(current, next, lambda, Math.min(delta, 0.1));

		node.position.x = damp(node.position.x, targetX, 5.2);
		node.position.y = damp(node.position.y, targetY, 5.2);
		node.position.z = damp(node.position.z, interp.z, 5.2);
		node.scale.setScalar(damp(node.scale.x, targetScale, 4.8));

		const tiltY = reduced ? interp.tilt : state.pointer.x * 0.14 + interp.tilt;
		const tiltX = reduced ? 0 : -state.pointer.y * 0.1;
		node.rotation.y = damp(node.rotation.y, tiltY, 3.8);
		node.rotation.x = damp(node.rotation.x, tiltX, 3.8);
	});

	return (
		<group ref={group} position={[0, 0, 0]}>
			<PortraitParticles count={particleCount} reduced={reduced} dark={dark} />
			<PortraitOrbit accent={target.accent} reduced={reduced} />
			<FloatingShapes
				accent={target.accent}
				reduced={reduced}
				opacity={dark ? 0.34 : 0.24}
			/>
			{children}
		</group>
	);
}
