import GradientASCII, {
	type GradientASCIIProps,
} from "#/components/GradientASCII";
import { useIsDark } from "#/lib/useIsDark";

interface AsciiBackdropProps {
	className?: string;
	/** Override the default blue palette (dim → bright). */
	colors?: GradientASCIIProps["colors"];
	shape?: GradientASCIIProps["shape"];
	cellSize?: number;
	density?: number;
	glow?: number;
	gradientOpacity?: number;
	glyphOpacity?: number;
	speed?: number;
	intro?: boolean;
	variation?: number;
	/** Scramble the characters under the cursor as it moves. */
	mouseInteraction?: boolean;
	clickEffect?: GradientASCIIProps["clickEffect"];
	/** Fade the bottom edge into the section background. */
	fade?: boolean;
}

export default function AsciiBackdrop({
	className = "",
	colors,
	shape = "horizon",
	cellSize = 18,
	density = 0.55,
	glow = 0.25,
	gradientOpacity = 0.4,
	glyphOpacity = 0.55,
	speed = 0.45,
	intro = false,
	variation = 0,
	mouseInteraction = true,
	clickEffect = "wave",
	fade = true,
}: AsciiBackdropProps) {
	const isDark = useIsDark();
	const palette =
		colors ??
		(isDark
			? ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]
			: ["#1e3fd8", "#0b0e17", "#38bdf8", "#a5d8ff"]);

	return (
		<div
			aria-hidden
			className={`pointer-events-none absolute overflow-hidden ${className}`}
			style={
				fade
					? {
							maskImage:
								"linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
							WebkitMaskImage:
								"linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
						}
					: undefined
			}
		>
			<GradientASCII
				colors={palette}
				shape={shape}
				cellSize={cellSize}
				density={density}
				glow={glow}
				gradientOpacity={gradientOpacity}
				glyphOpacity={glyphOpacity}
				softness={0.6}
				scale={1}
				flow={0.45}
				speed={speed}
				grain={0.05}
				variation={variation}
				mouseInteraction={mouseInteraction}
				clickEffect={clickEffect}
				intro={intro}
				lightMode={!isDark}
				className="size-full"
			/>
		</div>
	);
}
