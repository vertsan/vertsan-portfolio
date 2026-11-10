import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "#/data/profile";
import { useSceneSection } from "./scene/SceneContext";
import { Container, Glow, Magnetic, Reveal, SectionLabel } from "./ui";

const socials = [
	{ href: profile.socials.github, label: "GitHub", icon: Github },
	{ href: profile.socials.linkedin, label: "LinkedIn", icon: Linkedin },
];

export default function ContactSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const [copied, setCopied] = useState(false);

	useSceneSection(sectionRef, "contact", "#6ee7b7");

	useEffect(() => {
		if (!copied) return;
		const id = window.setTimeout(() => setCopied(false), 1800);
		return () => window.clearTimeout(id);
	}, [copied]);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(profile.email);
			setCopied(true);
		} catch {
			// Clipboard access can be blocked; fall back to selecting the mailto link.
			window.location.href = `mailto:${profile.email}`;
		}
	};

	return (
		<section
			ref={sectionRef}
			id="contact"
			aria-labelledby="contact-heading"
			className="relative overflow-hidden pt-24 pb-28 sm:pt-32 sm:pb-36"
		>
			<Glow className="left-1/2 top-1/3 size-[42rem] -translate-x-1/2 opacity-70" />

			<Container>
				<div className="mx-auto max-w-3xl text-center">
					<div className="flex justify-center">
						<SectionLabel>Contact</SectionLabel>
					</div>

					<h2
						id="contact-heading"
						className="mt-7 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
					>
						<Reveal>Let&apos;s build</Reveal>
						<Reveal delay={0.08}>
							<span className="immersive-gradient-text">something.</span>
						</Reveal>
					</h2>

					<motion.p
						initial={reduced ? false : { opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-10% 0px" }}
						transition={{ duration: 0.7, delay: 0.15 }}
						className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-[var(--i-muted)]"
					>
						I am {profile.availability.toLowerCase()} for full-time roles and
						selected freelance work. Tell me what you are building and I will
						reply within a day.
					</motion.p>

					<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Magnetic strength={14}>
							<a
								href={`mailto:${profile.email}`}
								className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--i-fg)] px-7 text-sm font-medium text-[var(--i-bg)] transition-colors hover:bg-[var(--i-fg)]/90 sm:text-base"
							>
								<Mail aria-hidden className="size-4" />
								{profile.email}
								<ArrowUpRight
									aria-hidden
									className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</a>
						</Magnetic>

						<Magnetic strength={10}>
							<button
								type="button"
								onClick={copyEmail}
								className="inline-flex h-14 items-center gap-2 rounded-full border border-[var(--i-line-strong)] bg-[var(--i-card)] px-6 text-sm font-medium text-[var(--i-fg)] backdrop-blur-md transition-colors hover:border-[var(--i-fg)]/40 hover:bg-[var(--i-card-strong)]"
							>
								{copied ? (
									<Check aria-hidden className="size-4 text-[#6ee7b7]" />
								) : (
									<Copy aria-hidden className="size-4" />
								)}
								{copied ? "Copied" : "Copy email"}
							</button>
						</Magnetic>
					</div>
					<p aria-live="polite" className="sr-only">
						{copied ? "Email address copied to clipboard" : ""}
					</p>

					<div className="mt-14 flex flex-col items-center justify-center gap-6 border-t border-[var(--i-line)] pt-8 sm:flex-row sm:justify-between">
						<p className="mono-label text-[var(--i-subtle)]">{profile.location}</p>

						<div className="flex items-center gap-2">
							{socials.map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noreferrer"
									aria-label={label}
									className="flex size-10 items-center justify-center rounded-full border border-[var(--i-line)] text-[var(--i-muted)] transition-colors hover:border-[var(--i-fg)]/30 hover:text-[var(--i-fg)]"
								>
									<Icon aria-hidden className="size-4" />
								</a>
							))}
							<a
								href="/resume.pdf"
								download
								className="ml-2 inline-flex items-center gap-1.5 text-sm text-[var(--i-muted)] transition-colors hover:text-[var(--i-fg)]"
							>
								Resume
								<ArrowUpRight aria-hidden className="size-3.5" />
							</a>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
