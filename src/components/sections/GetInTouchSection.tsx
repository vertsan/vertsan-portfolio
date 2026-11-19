import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import GradientASCII from "#/components/GradientASCII";
import { Button } from "#/components/ui/button";
import { GRADIENT_ASCII_COLORS } from "#/lib/gradient-ascii";

/** Radial falloff from the top edge, fading the shader into the card base. */
const ASCII_MASK: CSSProperties = {
	maskImage:
		"radial-gradient(120% 85% at 50% 0%, black 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
	WebkitMaskImage:
		"radial-gradient(120% 85% at 50% 0%, black 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
};

export default function GetInTouchSection() {
	return (
		<section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-32">
			<div className="mx-auto max-w-5xl px-4 sm:px-6">
				<div
					data-reveal
					className="relative rounded-[28px] border border-white/10 bg-[#0e0e11] px-6 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-20"
				>
					{/* Clipped background layer so the top badge can straddle the card. */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 select-none overflow-hidden rounded-[28px]"
					>
						<div className="absolute inset-0 opacity-[0.45]" style={ASCII_MASK}>
							<GradientASCII
								colors={GRADIENT_ASCII_COLORS}
								shape="horizon"
								characters=" =+xX0S8#@"
								cellSize={12}
								density={0.72}
								glyphOpacity={0.85}
								gradientOpacity={0.6}
								glow={0.1}
								softness={0.6}
								scale={1.1}
								flow={0.35}
								speed={0.6}
								flicker={0.1}
								depthOfField={0}
								grain={0.05}
								variation={0}
								mouseInteraction={false}
								clickEffect="none"
								scrambleRadius={0.1}
								intro={false}
								lightMode={false}
								className="size-full"
							/>
						</div>
						<div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-[#0e0e11]/40 to-[#0e0e11]" />
					</div>

					{/* Straddling dark-glass pill. */}
					<div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[#121215] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-200 backdrop-blur-md">
						Contact
					</div>

					<div className="relative z-10 flex flex-col items-center text-center">
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
							Get in Touch	
						</h2>

						<p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-300 md:text-lg">
							Wanna chat? Let's{" "}
							<a
								href="mailto:hello@vertsan.com?subject=Let's%20schedule%20a%20meet"
								className="font-medium text-[#38bdf8] underline-offset-4 hover:underline"
							>
								schedule a meet
							</a>{" "}
							or drop an{" "}
							<a
								href="mailto:hello@vertsan.com"
								className="font-medium text-[#38bdf8] underline-offset-4 hover:underline"
							>
								email
							</a>
							{"."} I will be ignoring all soliciting.
						</p>

						<div className="mt-9">
							<Button variant="ghost" asChild>
								<a href="mailto:hello@vertsan.com">
									<Mail className="size-4" />
									Send a Message
									<ArrowUpRight className="size-4" />
								</a>
							</Button>
						</div>

						<div className="mt-10 flex flex-col items-center gap-4">
							

							<div className="flex items-center justify-center gap-3">
								{[
									{
										href: "https://github.com/vertsan",
										label: "GitHub",
										icon: Github,
									},
									{
										href: "https://linkedin.com/in/vertsan",
										label: "LinkedIn",
										icon: Linkedin,
									},
									{
										href: "mailto:hello@vertsan.com",
										label: "Email",
										icon: Mail,
									},
								].map(({ href, label, icon: Icon }) => (
									<a
										key={label}
										href={href}
										target="_blank"
										rel="noreferrer"
										aria-label={label}
										className="inline-flex items-center justify-center size-10 rounded-full border border-white/10 bg-white/[0.02] text-neutral-300 transition-colors duration-200 hover:border-white/25 hover:bg-white/5 hover:text-white"
									>
										<Icon className="size-4" />
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
