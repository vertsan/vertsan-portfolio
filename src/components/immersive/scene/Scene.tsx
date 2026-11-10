import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";
import { useScene } from "./SceneContext";
import SceneRig from "./SceneRig";

/**
 * The single persistent WebGL scene for the home page.
 *
 * Kept deliberately small: one point cloud, two wireframes, optional bloom.
 * `PerformanceMonitor` demotes the scene on slow GPUs, which re-mounts this
 * component with a smaller particle budget.
 */
export default function Scene({
	particleCount,
	dark,
	reduced,
	bloom,
	onReady,
	onDecline,
}: {
	particleCount: number;
	dark: boolean;
	reduced: boolean;
	bloom: boolean;
	onReady: () => void;
	onDecline: () => void;
}) {
	const { target } = useScene();

	return (
		<Canvas
			dpr={[1, 2]}
			camera={{ position: [0, 0, 6], fov: 42 }}
			gl={{
				alpha: true,
				antialias: false,
				powerPreference: "high-performance",
			}}
			style={{ pointerEvents: "none" }}
			onCreated={({ gl }) => {
				gl.setClearAlpha(0);
				onReady();
			}}
		>
			<PerformanceMonitor
				onDecline={onDecline}
				flipflops={3}
				onFallback={() => onDecline()}
			/>

			<Suspense fallback={null}>
				<SceneRig
					target={target}
					reduced={reduced}
					dark={dark}
					particleCount={particleCount}
				/>
			</Suspense>

			{bloom ? (
				<EffectComposer enableNormalPass={false} multisampling={0}>
					<Bloom
						intensity={0.55}
						luminanceThreshold={0.22}
						luminanceSmoothing={0.4}
						mipmapBlur
					/>
				</EffectComposer>
			) : null}
		</Canvas>
	);
}
