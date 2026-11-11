import AboutHero from "#/components/about/AboutHero";
import BioCard from "#/components/about/BioCard";
import PortraitCard from "#/components/about/PortraitCard";
import GradientASCII from "#/components/GradientASCII";
import { ASCII_FADE_MASK, GRADIENT_ASCII_COLORS } from "#/lib/gradient-ascii";
import { useIsDark } from "#/lib/useIsDark";
import { cn } from "#/lib/utils";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";

/**
 * About page — premium, minimal, dark-first.
 *
 * What changed and why:
 * - The dithered portrait used to sit behind the whole page and collided with
 *   the heading, breadcrumb and bio. It now lives inside a contained portrait
 *   frame, so it can never overlap text.
 * - The drifting photo collage was replaced by one clear focal portrait plus a
 *   quiet thumbnail row, removing the cluttered, uneven crop.
 * - Shared surface tokens (near-black canvas, #111114 cards, one indigo accent)
 *   keep spacing, contrast and hierarchy consistent across the page.
 * - GradientASCII stays as a faint, masked backdrop for depth without
 *   competing with the copy.
 */
export default function AboutSection({
	hideIntro = false,
}: {
	/** Home already tells this story inside the hero. */
	hideIntro?: boolean;
}) {
	const isDark = useIsDark();

	return (
		<section
			id="about"
			className={cn(
				"relative scroll-mt-20 overflow-hidden",
				!hideIntro && "about-shell pt-16 pb-20 sm:pt-20 md:pt-24 md:pb-24",
			)}
		>
			{!hideIntro && (
				<>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-0 h-[100svh] overflow-hidden opacity-35 dark:opacity-45"
						style={ASCII_FADE_MASK}
					>
						<GradientASCII
							colors={GRADIENT_ASCII_COLORS}
							shape="horizon"
							cellSize={18}
							density={0.8}
							glyphOpacity={0.85}
							gradientOpacity={0.9}
							glow={0.2}
							softness={0.5}
							scale={1}
							flow={0.5}
							speed={0.4}
							flicker={0.2}
							depthOfField={0}
							grain={0.08}
							variation={0}
							mouseInteraction
							clickEffect="wave"
							intro={false}
							lightMode={!isDark}
							className="size-full"
						/>
					</div>
					<div
						aria-hidden
						className="ui-hero-glow pointer-events-none absolute inset-x-0 top-0 h-[40rem]"
					/>
				</>
			)}

			<div className="relative z-10 mx-auto w-full max-w-[75rem] px-5 sm:px-6">
				{!hideIntro && (
					<>
						<AboutHero />

						<div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-5">
								<PortraitCard />
							</div>
							<div className="lg:col-span-7">
								<BioCard />
							</div>
						</div>
					</>
				)}

				<ExperienceSection />
				<EducationSection />
			</div>
		</section>
	);
}
