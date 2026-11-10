import { motion, useReducedMotion } from "framer-motion";
import {
	ArrowUpRight,
	Check,
	Clock,
	Copy,
	Download,
	Github,
	Linkedin,
	Mail,
	MapPin,
	MessageSquare,
	Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "#/data/profile";
import { useSceneSection } from "./scene/SceneContext";
import { Container, Glow, Magnetic, Reveal, SectionLabel, TiltCard } from "./ui";

const PROJECT_TOPICS = [
	"Full-Stack Web App",
	"Mobile Engineering",
	"Frontend & 3D Motion",
	"System Architecture",
	"Full-Time Role",
];

function usePhnomPenhTime() {
	const [time, setTime] = useState("");
	useEffect(() => {
		const update = () => {
			const now = new Date();
			setTime(
				new Intl.DateTimeFormat("en-US", {
					timeZone: "Asia/Phnom_Penh",
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}).format(now),
			);
		};
		update();
		const timer = setInterval(update, 1000);
		return () => clearInterval(timer);
	}, []);
	return time;
}

export default function ContactSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const [copied, setCopied] = useState(false);
	const [selectedTopic, setSelectedTopic] = useState(PROJECT_TOPICS[0]);
	const localTime = usePhnomPenhTime();

	useSceneSection(sectionRef, "contact", "#6ee7b7");

	useEffect(() => {
		if (!copied) return;
		const id = window.setTimeout(() => setCopied(false), 2000);
		return () => window.clearTimeout(id);
	}, [copied]);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(profile.email);
			setCopied(true);
		} catch {
			window.location.href = `mailto:${profile.email}`;
		}
	};

	const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
		`Inquiry: ${selectedTopic} — [Your Name/Company]`,
	)}&body=${encodeURIComponent(
		`Hi Vert,\n\nI came across your portfolio and would like to discuss a project regarding ${selectedTopic}.\n\nProject details:\n- Timeline:\n- Scope / Goals:\n\nLooking forward to hearing from you!`,
	)}`;

	return (
		<section
			ref={sectionRef}
			id="contact"
			aria-labelledby="contact-heading"
			className="relative overflow-visible pt-24 pb-28 sm:pt-32 sm:pb-36"
		>
			<Glow
				className="pointer-events-none left-1/2 top-1/4 size-[48rem] -translate-x-1/2 opacity-65"
				color="rgba(110,231,183,0.14)"
			/>

			<Container>
				{/* Header */}
				<div className="mx-auto max-w-3xl text-center">
					<div className="flex justify-center">
						<SectionLabel>Contact & Inquiries</SectionLabel>
					</div>

					<h2
						id="contact-heading"
						className="mt-6 font-display text-[clamp(2.5rem,6.5vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
					>
						<Reveal>Let&apos;s build</Reveal>
						<Reveal delay={0.08}>
							<span className="immersive-gradient-text">something exceptional.</span>
						</Reveal>
					</h2>

					<motion.p
						initial={reduced ? false : { opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-10% 0px" }}
						transition={{ duration: 0.7, delay: 0.15 }}
						className="mx-auto mt-6 max-w-xl text-pretty text-sm leading-relaxed text-[var(--i-muted)] sm:text-base"
					>
						Available for full-time engineering roles, technical lead opportunities,
						and selective high-impact contracts. Direct inbox access below.
					</motion.p>
				</div>

				{/* Bento Grid */}
				<div className="mt-14 grid grid-cols-12 gap-5 lg:gap-6">
					{/* Left: Direct Outreach Card */}
					<div className="col-span-12 lg:col-span-7">
						<TiltCard max={4} className="h-full rounded-3xl">
							<article className="glass relative flex h-full flex-col justify-between overflow-hidden p-7 sm:p-9">
								<span
									aria-hidden
									className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br from-[#6ee7b7]/15 via-transparent to-transparent blur-3xl"
								/>

								<div>
									{/* Status & Local Time Badges */}
									<div className="flex flex-wrap items-center gap-3">
										<span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-[#6ee7b7]">
											<span className="relative flex size-2">
												<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#6ee7b7] opacity-60" />
												<span className="relative inline-flex size-2 rounded-full bg-[#6ee7b7]" />
											</span>
											{profile.availability}
										</span>

										<span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--i-line)] bg-[var(--i-card)] px-3 py-1.5 font-mono text-[11px] text-[var(--i-subtle)]">
											<MapPin className="size-3 text-[#2dd4bf]" aria-hidden />
											{profile.location}
										</span>

										{localTime && (
											<span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--i-line)] bg-[var(--i-card)] px-3 py-1.5 font-mono text-[11px] text-[var(--i-subtle)]">
												<Clock className="size-3" aria-hidden />
												{localTime} ICT (UTC+7)
											</span>
										)}
									</div>

									<h3 className="mt-7 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
										Have a project in mind or an open seat on your team?
									</h3>
									<p className="mt-3 text-sm leading-relaxed text-[var(--i-muted)] sm:text-base">
										Send an inquiry directly to my primary email. I read every message
										and aim to respond within 24 hours.
									</p>
								</div>

								{/* Primary Action Buttons */}
								<div className="mt-9 pt-6 border-t border-[var(--i-line)]">
									<div className="flex flex-wrap items-center gap-3">
										<Magnetic strength={12}>
											<a
												href={mailtoUrl}
												className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-[var(--i-fg)] px-6 text-sm font-semibold text-[var(--i-bg)] transition-all hover:bg-[var(--i-fg)]/90 sm:px-7"
											>
												<Mail className="size-4" aria-hidden />
												<span>Send Email</span>
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
												className="inline-flex h-13 items-center gap-2 rounded-full border border-[var(--i-line-strong)] bg-[var(--i-card)] px-5 text-sm font-medium text-[var(--i-fg)] backdrop-blur-md transition-colors hover:border-[var(--i-fg)]/40 hover:bg-[var(--i-card-strong)]"
											>
												{copied ? (
													<Check aria-hidden className="size-4 text-[#6ee7b7]" />
												) : (
													<Copy aria-hidden className="size-4 text-[var(--i-subtle)]" />
												)}
												<span>{copied ? "Copied!" : profile.email}</span>
											</button>
										</Magnetic>
									</div>

									<p className="mt-3.5 font-mono text-[11px] text-[var(--i-subtle)]">
										Prefer direct copy? One-click copies address to your clipboard.
									</p>
								</div>
							</article>
						</TiltCard>
					</div>

					{/* Right: Quick Scope & Socials Bento */}
					<div className="col-span-12 flex flex-col gap-5 lg:col-span-5">
						{/* Inquiry Scope Selector Card */}
						<TiltCard max={4} className="rounded-3xl">
							<article className="glass relative overflow-hidden p-6 sm:p-7">
								<div className="flex items-center gap-2">
									<Sparkles className="size-4 text-[#2dd4bf]" aria-hidden />
									<span className="mono-label text-[var(--i-subtle)]">Quick Inquiry Scope</span>
								</div>

								<p className="mt-3 text-xs text-[var(--i-muted)]">
									Select a topic to auto-format your message subject:
								</p>

								<div className="mt-4 flex flex-wrap gap-2">
									{PROJECT_TOPICS.map((topic) => {
										const active = selectedTopic === topic;
										return (
											<button
												key={topic}
												type="button"
												onClick={() => setSelectedTopic(topic)}
												className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all ${
													active
														? "border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#2dd4bf] shadow-[0_0_12px_rgba(45,212,191,0.2)]"
														: "border-[var(--i-line)] bg-[var(--i-card)] text-[var(--i-subtle)] hover:border-[var(--i-fg)]/30 hover:text-[var(--i-fg)]"
												}`}
											>
												{topic}
											</button>
										);
									})}
								</div>

								<a
									href={mailtoUrl}
									className="group/link mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#2dd4bf] hover:underline"
								>
									<MessageSquare className="size-3.5" aria-hidden />
									Compose with pre-filled draft
									<ArrowUpRight
										aria-hidden
										className="size-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
									/>
								</a>
							</article>
						</TiltCard>

						{/* Links Grid: GitHub, LinkedIn, Resume */}
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
							<a
								href={profile.socials.github}
								target="_blank"
								rel="noreferrer"
								className="group glass flex flex-col justify-between rounded-2xl p-4 transition-all hover:border-[var(--i-fg)]/30 hover:bg-[var(--i-card-strong)]"
							>
								<div className="flex items-center justify-between">
									<Github className="size-4 text-[var(--i-muted)] group-hover:text-[var(--i-fg)]" />
									<ArrowUpRight className="size-3.5 text-[var(--i-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--i-fg)]" />
								</div>
								<div className="mt-4">
									<p className="mono-label text-[10px] text-[var(--i-subtle)]">Codebase</p>
									<p className="font-display text-sm font-semibold text-[var(--i-fg)]">GitHub</p>
								</div>
							</a>

							<a
								href={profile.socials.linkedin}
								target="_blank"
								rel="noreferrer"
								className="group glass flex flex-col justify-between rounded-2xl p-4 transition-all hover:border-[var(--i-fg)]/30 hover:bg-[var(--i-card-strong)]"
							>
								<div className="flex items-center justify-between">
									<Linkedin className="size-4 text-[var(--i-muted)] group-hover:text-[#38bdf8]" />
									<ArrowUpRight className="size-3.5 text-[var(--i-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--i-fg)]" />
								</div>
								<div className="mt-4">
									<p className="mono-label text-[10px] text-[var(--i-subtle)]">Network</p>
									<p className="font-display text-sm font-semibold text-[var(--i-fg)]">LinkedIn</p>
								</div>
							</a>

							<a
								href={profile.resume}
								download
								className="group glass flex flex-col justify-between rounded-2xl p-4 transition-all hover:border-[#6ee7b7]/40 hover:bg-[var(--i-card-strong)]"
							>
								<div className="flex items-center justify-between">
									<Download className="size-4 text-[var(--i-muted)] group-hover:text-[#6ee7b7]" />
									<ArrowUpRight className="size-3.5 text-[var(--i-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--i-fg)]" />
								</div>
								<div className="mt-4">
									<p className="mono-label text-[10px] text-[var(--i-subtle)]">Curriculum</p>
									<p className="font-display text-sm font-semibold text-[var(--i-fg)]">Resume PDF</p>
								</div>
							</a>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
