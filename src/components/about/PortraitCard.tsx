import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import DitherVeil from "#/components/DitherVeil";
import { useIsDark } from "#/lib/useIsDark";

const thumbnails = [
	{ src: "/profile1.webp", alt: "Vert San portrait, photo 1" },
	{ src: "/profile2.webp", alt: "Vert San portrait, photo 2" },
	{ src: "/profile3.webp", alt: "Vert San portrait, photo 3" },
	{ src: "/profile4.webp", alt: "Vert San portrait, photo 4" },
];

function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduced(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);

	return reduced;
}

/**
 * One clear focal portrait inside a contained rounded frame. The dithered
 * portrait can never overlap page copy because it is clipped to this card.
 */
export default function PortraitCard() {
	const isDark = useIsDark();
	const reducedMotion = usePrefersReducedMotion();

	return (
		<figure className="mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
			<div
				data-reveal
				className="ui-card relative aspect-[4/5] w-full overflow-hidden"
			>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							"radial-gradient(75% 60% at 50% 18%, var(--ui-glow) 0%, transparent 70%)",
					}}
				/>

				<div className="absolute inset-0">
					{reducedMotion ? (
						<img
							src="/hero-portrait-cutout.png"
							alt="Portrait of Vert San"
							width={700}
							height={969}
							loading="lazy"
							decoding="async"
							className="size-full object-contain p-6"
						/>
					) : (
						<DitherVeil
							src="/hero-portrait-cutout.png"
							fit="contain"
							pattern="floyd"
							pixelSize={3}
							levels={3}
							palette="duotone"
							inkColor={isDark ? "#eef0ff" : "#111114"}
							paperColor={isDark ? "#0b0b0f" : "#f4f4f7"}
							contrast={1.25}
							brightness={0.05}
							revealRadius={900}
							softness={0.9}
							linger={2}
							rimColor={isDark ? "#818cf8" : "#4f46e5"}
							rim={0.14}
							wander
							className="size-full"
						/>
					)}
				</div>

				<div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							"radial-gradient(80% 70% at 50% 42%, transparent 42%, var(--ui-vignette) 100%)",
					}}
				/>
			</div>

			<div
				data-reveal
				style={{ "--reveal-delay": "80ms" } as CSSProperties}
				className="mt-3 grid grid-cols-4 gap-3"
			>
				{thumbnails.map((thumb) => (
					<div key={thumb.src} className="ui-thumb aspect-square">
						<img
							src={thumb.src}
							alt={thumb.alt}
							width={160}
							height={160}
							loading="lazy"
							decoding="async"
							className="size-full object-cover"
						/>
					</div>
				))}
			</div>

			<figcaption className="sr-only">
				Portrait and photos of Vert San
			</figcaption>
		</figure>
	);
}
