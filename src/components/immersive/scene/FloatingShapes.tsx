import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Faint wireframe geometry drifting behind the portrait. Two primitives, slow
 * rotation, no interaction: they exist to give the dark field a sense of depth.
 */
export default function FloatingShapes({
	accent,
	reduced = false,
	opacity = 0.3,
}: {
	accent: string;
	reduced?: boolean;
	opacity?: number;
}) {
	const knot = useRef<THREE.Mesh>(null);
	const ico = useRef<THREE.Mesh>(null);
	const color = useMemo(() => new THREE.Color(accent), [accent]);

	useFrame((state, delta) => {
		if (reduced) return;
		const t = state.clock.elapsedTime;
		if (knot.current) {
			knot.current.rotation.x += delta * 0.12;
			knot.current.rotation.y += delta * 0.16;
			knot.current.position.y = 0.9 + Math.sin(t * 0.4) * 0.16;
		}
		if (ico.current) {
			ico.current.rotation.y -= delta * 0.1;
			ico.current.rotation.z += delta * 0.06;
			ico.current.position.y = -1.35 + Math.cos(t * 0.33) * 0.14;
		}
	});

	return (
		<group>
			<mesh ref={knot} position={[-2.55, 0.9, -2.4]} scale={0.62}>
				<torusKnotGeometry args={[0.7, 0.2, 128, 16]} />
				<meshBasicMaterial
					wireframe
					color={color}
					transparent
					opacity={opacity * 0.55}
					toneMapped={false}
				/>
			</mesh>

			<mesh ref={ico} position={[2.75, -1.35, -2.8]} scale={0.9}>
				<icosahedronGeometry args={[0.9, 1]} />
				<meshBasicMaterial
					wireframe
					color="#2dd4bf"
					transparent
					opacity={opacity * 0.4}
					toneMapped={false}
				/>
			</mesh>
		</group>
	);
}
