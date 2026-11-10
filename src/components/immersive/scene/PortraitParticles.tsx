import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PORTRAIT_SRC = "/hero-portrait-cutout.png";
/** Portrait height in world units at the hero position. */
const PORTRAIT_HEIGHT = 3.05;

interface ParticleData {
	positions: Float32Array;
	colors: Float32Array;
	starts: Float32Array;
	delays: Float32Array;
	scales: Float32Array;
	count: number;
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aColor;
  attribute vec3 aStart;
  attribute float aDelay;
  attribute float aScale;

  varying vec3 vColor;
  varying float vAlpha;

  float easeOutCubic(float x) {
    return 1.0 - pow(1.0 - x, 3.0);
  }

  void main() {
    // Staggered assembly: every particle resolves at a slightly different time,
    // bottom-up, so the portrait "develops" like a print instead of popping in.
    float t = clamp((uProgress - aDelay * 0.45) / 0.55, 0.0, 1.0);
    t = easeOutCubic(t);

    vec3 pos = mix(aStart, position, t);

    // Slow breathing drift keeps the surface from looking like a static photo.
    float breathe = sin(uTime * 0.7 + aDelay * 14.0) * 0.009 * t;
    pos.xy += vec2(breathe, breathe * 0.6);

    // Cursor repulsion. uPointer arrives in this object's local space.
    vec2 delta = pos.xy - uPointer.xy;
    float dist = length(delta);
    float falloff = smoothstep(0.95, 0.0, dist);
    float push = falloff * uPointerStrength;
    pos.xy += normalize(delta + vec2(1e-5)) * push * 0.34;
    pos.z += push * 0.55;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Square points preserve the pixel-dither identity; size attenuates with depth.
    gl_PointSize = uSize * aScale * uPixelRatio * (6.0 / -mvPosition.z);

    vColor = aColor;
    vAlpha = t;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Deliberately square: no circular point mask, so each particle reads as a pixel.
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.decoding = "async";
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(`Could not load ${src}`));
		image.src = src;
	});
}

/**
 * Samples the portrait into a point cloud.
 *
 * Every opaque pixel is a candidate. Candidates are strided down to the target
 * count, colours are quantised into a handful of levels (the dither palette),
 * and shadows are pulled slightly toward indigo so the silhouette survives on
 * a near-black canvas.
 */
async function buildParticles(count: number): Promise<ParticleData> {
	const image = await loadImage(PORTRAIT_SRC);
	const aspect = image.height / image.width;
	const sampleWidth = Math.min(
		380,
		Math.max(140, Math.round(Math.sqrt((count * 1.7) / aspect))),
	);
	const sampleHeight = Math.round(sampleWidth * aspect);

	const canvas = document.createElement("canvas");
	canvas.width = sampleWidth;
	canvas.height = sampleHeight;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("2D canvas unavailable");
	ctx.drawImage(image, 0, 0, sampleWidth, sampleHeight);
	const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);

	type Candidate = { x: number; y: number; r: number; g: number; b: number; lum: number };
	const candidates: Candidate[] = [];

	for (let y = 0; y < sampleHeight; y += 1) {
		for (let x = 0; x < sampleWidth; x += 1) {
			const index = (y * sampleWidth + x) * 4;
			const alpha = data[index + 3];
			if (alpha < 32) continue;
			const r = data[index] / 255;
			const g = data[index + 1] / 255;
			const b = data[index + 2] / 255;
			const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			if (lum < 0.03) continue;
			candidates.push({ x, y, r, g, b, lum });
		}
	}

	if (candidates.length === 0) throw new Error("Portrait produced no samples");

	const stride = Math.max(1, Math.floor(candidates.length / count));
	const total = Math.ceil(candidates.length / stride);
	const positions = new Float32Array(total * 3);
	const colors = new Float32Array(total * 3);
	const starts = new Float32Array(total * 3);
	const delays = new Float32Array(total);
	const scales = new Float32Array(total);

	const width = PORTRAIT_HEIGHT / aspect;
	const levels = 6;
	const quantise = (value: number) => Math.round(value * levels) / levels;
	const tint = { r: 0.39, g: 0.4, b: 0.95 };

	let index = 0;
	for (let i = 0; i < candidates.length; i += stride) {
		const pixel = candidates[i];
		if (!pixel) continue;

		const x = (pixel.x / sampleWidth - 0.5) * width;
		const y = (0.5 - pixel.y / sampleHeight) * PORTRAIT_HEIGHT;
		const z = (pixel.lum - 0.5) * 0.3 + (Math.random() - 0.5) * 0.04;

		positions[index * 3] = x;
		positions[index * 3 + 1] = y;
		positions[index * 3 + 2] = z;

		// Shadows drift toward the indigo accent; highlights keep their own hue.
		const mix = 0.2 * (1 - pixel.lum);
		const r = quantise(pixel.r) * (1 - mix) + tint.r * mix;
		const g = quantise(pixel.g) * (1 - mix) + tint.g * mix;
		const b = quantise(pixel.b) * (1 - mix) + tint.b * mix;
		colors[index * 3] = Math.min(1, r * 1.06);
		colors[index * 3 + 1] = Math.min(1, g * 1.06);
		colors[index * 3 + 2] = Math.min(1, b * 1.06);

		// Noise start: a loose shell around the final position.
		const radius = 1.9 + Math.random() * 1.4;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		starts[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
		starts[index * 3 + 1] = Math.cos(phi) * radius * 0.8;
		starts[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius * 0.6;

		// Bottom-up delay with a little jitter.
		delays[index] = Math.min(
			1,
			Math.max(0, (y / PORTRAIT_HEIGHT + 0.5) * 0.8 + Math.random() * 0.2),
		);
		scales[index] = 0.75 + Math.random() * 0.55;
		index += 1;
	}

	return {
		positions: positions.slice(0, index * 3),
		colors: colors.slice(0, index * 3),
		starts: starts.slice(0, index * 3),
		delays: delays.slice(0, index),
		scales: scales.slice(0, index),
		count: index,
	};
}

export default function PortraitParticles({
	count,
	reduced = false,
	dark = true,
}: {
	count: number;
	reduced?: boolean;
	dark?: boolean;
}) {
	const pointsRef = useRef<THREE.Points>(null);
	const [data, setData] = useState<ParticleData | null>(null);
	const { gl, camera } = useThree();

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uProgress: { value: reduced ? 1 : 0 },
			uPointer: { value: new THREE.Vector3(0, 0, 0) },
			uPointerStrength: { value: 0 },
			uSize: { value: 1.65 },
			uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
		}),
		[gl, reduced],
	);

	const geometry = useMemo(() => {
		if (!data) return null;
		const next = new THREE.BufferGeometry();
		next.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
		next.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
		next.setAttribute("aStart", new THREE.BufferAttribute(data.starts, 3));
		next.setAttribute("aDelay", new THREE.BufferAttribute(data.delays, 1));
		next.setAttribute("aScale", new THREE.BufferAttribute(data.scales, 1));
		next.computeBoundingSphere();
		return next;
	}, [data]);

	useEffect(() => {
		if (reduced) {
			setData(null);
			return;
		}
		let cancelled = false;
		buildParticles(count)
			.then((next) => {
				if (!cancelled) setData(next);
			})
			.catch(() => {
				// A missing portrait should never break the page; shapes still render.
				if (!cancelled) setData(null);
			});
		return () => {
			cancelled = true;
		};
	}, [count, reduced]);

	useEffect(() => {
		return () => {
			geometry?.dispose();
		};
	}, [geometry]);

	// Track whether the pointer is actually over the page, so particles do not
	// repel from the top-left corner before the first mouse move.
	const pointerActive = useRef(false);
	useEffect(() => {
		const activate = (event: PointerEvent) => {
			pointerActive.current = event.pointerType !== "touch";
		};
		const deactivate = () => {
			pointerActive.current = false;
		};
		window.addEventListener("pointermove", activate, { passive: true });
		window.addEventListener("pointerleave", deactivate);
		return () => {
			window.removeEventListener("pointermove", activate);
			window.removeEventListener("pointerleave", deactivate);
		};
	}, []);

	const raycaster = useMemo(() => new THREE.Raycaster(), []);
	const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
	const hit = useMemo(() => new THREE.Vector3(), []);
	const local = useMemo(() => new THREE.Vector3(), []);

	useFrame((state, delta) => {
		uniforms.uTime.value = state.clock.elapsedTime;
		uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);

		if (!reduced) {
			uniforms.uProgress.value = Math.min(
				1,
				uniforms.uProgress.value + delta / 2,
			);
		}

		const points = pointsRef.current;
		if (points) {
			raycaster.setFromCamera(state.pointer, camera);
			points.getWorldPosition(hit);
			plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), hit);
			const intersection = raycaster.ray.intersectPlane(plane, local);
			if (intersection) {
				const target = points.worldToLocal(local.clone());
				uniforms.uPointer.value.lerp(target, 0.16);
			}
			const targetStrength = pointerActive.current && !reduced ? 1 : 0;
			uniforms.uPointerStrength.value +=
				(targetStrength - uniforms.uPointerStrength.value) * Math.min(1, delta * 6);
		}
	});

	if (!geometry || !data) return null;

	return (
		<points ref={pointsRef} frustumCulled={false}>
			<primitive object={geometry} attach="geometry" />
			<shaderMaterial
				vertexShader={VERTEX_SHADER}
				fragmentShader={FRAGMENT_SHADER}
				uniforms={uniforms}
				transparent
				depthWrite={false}
				toneMapped={false}
				blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
			/>
		</points>
	);
}
