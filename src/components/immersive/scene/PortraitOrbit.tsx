import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function PortraitOrbit({
	accent,
	reduced,
}: {
	accent: string;
	reduced: boolean;
}) {
	const orbit = useRef<THREE.Group>(null);
	const color = useMemo(() => new THREE.Color(accent), [accent]);

	useFrame((state, delta) => {
		if (!orbit.current || reduced) return;
		orbit.current.rotation.z += delta * 0.035;
		orbit.current.rotation.x =
			0.72 + Math.sin(state.clock.elapsedTime * 0.16) * 0.025;
	});

	return (
		<group ref={orbit} position={[0, 0, -0.55]}>
			<mesh scale={[0.72, 1.08, 1]}>
				<torusGeometry args={[1.75, 0.007, 6, 144]} />
				<meshBasicMaterial
					color={color}
					transparent
					opacity={0.24}
					depthWrite={false}
					toneMapped={false}
				/>
			</mesh>
			<mesh position={[0, 1.75, 0]}>
				<sphereGeometry args={[0.025, 8, 8]} />
				<meshBasicMaterial color={color} toneMapped={false} />
			</mesh>
		</group>
	);
}
