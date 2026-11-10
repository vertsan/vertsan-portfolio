import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import FloatingShapes from "./FloatingShapes";
import PortraitOrbit from "./PortraitOrbit";
import PortraitParticles from "./PortraitParticles";
import type { SceneMode, SceneTarget } from "./SceneContext";

interface Layout {
	/** Horizontal anchor as a fraction of the viewport width. */
	x: number;
	/** Vertical anchor as a fraction of the viewport height. */
	y: number;
	z: number;
	scale: number;
	tilt: number;
}

/**
 * Where the portrait lives per section. Fractions (not world units) keep the
 * composition intact from a phone to an ultrawide display.
 */
const LAYOUT: Record<SceneMode, Layout> = {
	hero: { x: 0.21, y: 0.02, z: 0, scale: 1, tilt: 0 },
	about: { x: -0.3, y: 0.04, z: -0.7, scale: 0.58, tilt: -0.22 },
	experience: { x: 0.34, y: -0.18, z: -1.3, scale: 0.3, tilt: 0.18 },
	projects: { x: 0.35, y: 0.28, z: -1.5, scale: 0.22, tilt: 0.3 },
	skills: { x: -0.35, y: 0.26, z: -1.6, scale: 0.2, tilt: -0.3 },
	certificates: { x: 0.34, y: -0.28, z: -1.6, scale: 0.2, tilt: 0.26 },
	contact: { x: 0, y: 0.3, z: -1.1, scale: 0.36, tilt: 0 },
};

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

	useFrame((state, delta) => {
		const node = group.current;
		if (!node) return;

		const mobile = size.width < 768;
		const layout =
			mobile && target.mode === "hero"
				? { x: 0, y: -0.3, z: -0.5, scale: 0.62, tilt: 0 }
				: LAYOUT[target.mode];
		const scaleBase = THREE.MathUtils.clamp(viewport.width / 7.6, 0.42, 1);
		const targetX = viewport.width * layout.x;
		const targetY = viewport.height * layout.y;
		const targetScale = layout.scale * scaleBase;

		const damp = (current: number, next: number, lambda: number) =>
			THREE.MathUtils.damp(current, next, lambda, Math.min(delta, 0.1));

		node.position.x = damp(node.position.x, targetX, 3.4);
		node.position.y = damp(node.position.y, targetY, 3.4);
		node.position.z = damp(node.position.z, layout.z, 3.4);
		node.scale.setScalar(damp(node.scale.x, targetScale, 3.2));

		const tiltY = reduced ? layout.tilt : state.pointer.x * 0.16 + layout.tilt;
		const tiltX = reduced ? 0 : -state.pointer.y * 0.1;
		node.rotation.y = damp(node.rotation.y, tiltY, 2.6);
		node.rotation.x = damp(node.rotation.x, tiltX, 2.6);
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
