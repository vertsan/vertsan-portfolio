import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import {
	ArrowDown,
	CheckCircle2,
	Clock,
	Cpu,
	Layers,
	MapPin,
	ShieldCheck,
	Sparkles,
	Terminal,
	Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { certificates } from "#/data/certificates";
import { experience, yearsOfExperience } from "#/data/experience";
import { profile } from "#/data/profile";
import { projects } from "#/data/projects";
import { scrollToId } from "./SmoothScroll";
import { useSceneSection } from "./scene/SceneContext";
import { Container, CountUp, EASE, Glow, SectionLabel, TiltCard } from "./ui";

const principles = [
	{
		icon: Zap,
		title: "Sub-50ms Latency",
		desc: "Optimized queries, lean bundles, and zero-jank 60FPS UI.",
	},
	{
		icon: ShieldCheck,
		title: "Strict Type Safety",
		desc: "End-to-end Zod & TypeScript contracts from DB to UI.",
	},
	{
		icon: Layers,
		title: "Scalable Architecture",
		desc: "Modular systems engineered to grow gracefully.",
	},
];

/** Word component with active luminescence and color highlight on scroll */
function IlluminatedWord({
	word,
	index,
	total,
	progress,
}: {
	word: string;
	index: number;
	total: number;
	progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
	const reduced = useReducedMotion();
	const start = (index / total) * 0.75;
	const end = Math.min(1, start + 0.2);

	const opacity = useTransform(progress, [start, end], [0.38, 1]);
	const color = useTransform(
		progress,
		[start, (start + end) / 2, end],
		["#64748b", "#38bdf8", "#ffffff"],
	);

	return (
		<span className="mr-[0.28em] inline-block">
			<motion.span
				style={reduced ? undefined : { opacity, color }}
				className="inline-block transition-colors duration-150 will-change-[opacity,color]"
			>
				{word}
			</motion.span>
		</span>
	);
}

export default function AboutStatement() {
	const sectionRef = useRef<HTMLElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const [revealDone, setRevealDone] = useState(false);
	const [timeString, setTimeString] = useState("");

	// Tight scroll offset: reveal completes by the time the text reaches the upper-middle of viewport
	const { scrollYProgress } = useScroll({
		target: textRef,
		offset: ["start 0.85", "center 0.45"],
	});

	useMotionValueEvent(scrollYProgress, "change", (val) => {
		if (val >= 0.95 && !revealDone) {
			setRevealDone(true);
		} else if (val < 0.85 && revealDone) {
			setRevealDone(false);
		}
	});

	useSceneSection(sectionRef, "about", "#6366f1");

	// Local Phnom Penh time (UTC+7)
	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			const formatted = new Intl.DateTimeFormat("en-US", {
				timeZone: "Asia/Phnom_Penh",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			}).format(now);
			setTimeString(`${formatted} (ICT)`);
		};
		updateTime();
		const timer = setInterval(updateTime, 1000);
		return () => clearInterval(timer);
	}, []);

	const words = profile.statement.split(" ");
	const years = yearsOfExperience(experience);

	const stats = [
		{
			label: "Years building",
			value: years,
			suffix: "+",
			tag: "Engineering",
			desc: "Full-stack & Mobile systems",
		},
		{
			label: "Projects shipped",
			value: projects.length,
			suffix: "",
			tag: "Production",
			desc: "Start-to-ship deliveries",
		},
		{
			label: "Users reached",
			value: profile.usersReached,
			suffix: "+",
			tag: "Global scale",
			desc: "Active consumer & enterprise scale",
		},
		{
			label: "Certificates",
			value: certificates.length,
			suffix: "",
			tag: "Verified",
			desc: "Cloud, security & dev credentials",
		},
	];

	return (
		<section
			ref={sectionRef}
			id="about"
			aria-labelledby="about-heading"
			className="relative overflow-visible py-28 sm:py-36 lg:py-44"
		>
			{/* Ambient radial glows */}
			<Glow
				className="-right-32 top-20 size-[36rem] opacity-40 pointer-events-none"
				color="rgba(99,102,241,0.2)"
			/>
			<Glow
				className="-left-32 bottom-20 size-[32rem] opacity-30 pointer-events-none"
				color="rgba(45,212,191,0.15)"
			/>

			<Container>
				{/* Top 12-column layout */}
				<div className="grid grid-cols-12 gap-y-12 lg:gap-x-14">
					{/* Left Column: Philosophy & Live Status */}
					<div className="col-span-12 lg:col-span-5">
						<div className="lg:sticky lg:top-36 space-y-7">
							<div>
								<SectionLabel>01 {"//"} About &amp; Philosophy</SectionLabel>
								<h2
									id="about-heading"
									className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-[3.25rem] text-white"
								>
									Quiet systems.
									<span className="block mt-1 bg-gradient-to-r from-[#818cf8] via-[#2dd4bf] to-[#6ee7b7] bg-clip-text text-transparent">
										Loud results.
									</span>
								</h2>
							</div>

							<p className="text-sm leading-relaxed text-white/70 max-w-sm">
								Software engineer based in{" "}
								<span className="text-white font-medium">
									{profile.location}
								</span>
								. Architecting clean architectures that hold up under heavy
								real-world demands.
							</p>

							{/* Live Location & Local Time Pill */}
							<div className="flex flex-wrap items-center gap-2 pt-1">
								<span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/80 backdrop-blur-md">
									<MapPin className="size-3 text-[#38bdf8]" aria-hidden />
									{profile.location}
								</span>
								{timeString && (
									<span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/60 backdrop-blur-md">
										<Clock className="size-3 text-[#2dd4bf]" aria-hidden />
										{timeString}
									</span>
								)}
							</div>

							{/* Core Engineering Principles Mini-Stack */}
							<div className="space-y-2.5 pt-3">
								<p className="font-mono text-[11px] uppercase tracking-wider text-white/40">
									Core Principles:
								</p>
								<div className="grid gap-2">
									{principles.map(({ icon: Icon, title, desc }) => (
										<div
											key={title}
											className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.06]"
										>
											<div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[#38bdf8]">
												<Icon className="size-3.5" />
											</div>
											<div>
												<p className="font-display text-xs font-semibold text-white/90">
													{title}
												</p>
												<p className="text-[11px] leading-relaxed text-white/50">
													{desc}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Dynamic Statement, Narrative & Action Bridge */}
					<div className="col-span-12 lg:col-span-7 flex flex-col justify-between">
						<div>
							{/* Reading Status Pill */}
							<div className="flex items-center justify-between pb-4 border-b border-white/10">
								<span className="font-mono text-[11px] uppercase tracking-wider text-white/50 flex items-center gap-1.5">
									<Sparkles className="size-3 text-[#38bdf8]" />
									Statement of craft
								</span>
								<span
									className={`font-mono text-xs transition-colors duration-300 flex items-center gap-1.5 ${
										revealDone ? "text-[#6ee7b7]" : "text-white/40"
									}`}
								>
									{revealDone ? (
										<>
											<CheckCircle2 className="size-3.5 text-[#6ee7b7]" />
											Ready to scroll below
										</>
									) : (
										"Scroll to illuminate"
									)}
								</span>
							</div>

							{/* Large Illuminated Statement */}
							<div ref={textRef} className="pt-6">
								<p className="flex flex-wrap font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.28] tracking-[-0.025em]">
									{words.map((word, index) => (
										<IlluminatedWord
											// biome-ignore lint/suspicious/noArrayIndexKey: words in statement are ordered by index
											key={`${word}-${index}`}
											word={word}
											index={index}
											total={words.length}
											progress={scrollYProgress}
										/>
									))}
								</p>
							</div>

							{/* Narrative Detail Bento Card */}
							<motion.div
								initial={reduced ? false : { opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.1 }}
								transition={{ duration: 0.6, ease: EASE }}
								className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4"
							>
								<div className="flex items-center gap-2 pb-2 text-[#38bdf8] font-mono text-xs font-semibold">
									<Terminal className="size-4" />
									<span>Engineering Methodology</span>
								</div>
								<p className="text-sm leading-relaxed text-white/75 sm:text-base">
									I care deeply about the unglamorous parts: strict type
									boundaries, honest loading states, intuitive keyboard
									navigation, and database indexes that keep queries blazing
									fast even as tables swell into the millions.
								</p>
								<p className="text-sm leading-relaxed text-white/75 sm:text-base">
									Most of my day is spent connecting ambitious visual designs
									with rock-solid backend APIs, hardening security, tuning
									micro-interactions, and testing edge cases before they ever
									hit production.
								</p>
							</motion.div>
						</div>

						{/* ==================================================================== */}
						{/* NEXT SECTION BRIDGE: SCROLL TO EXPERIENCE                           */}
						{/* Fulfills: "revealing is ready should be scroll into the next page"  */}
						{/* ==================================================================== */}
						<motion.div
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md"
						>
							<div className="flex items-center gap-3">
								<span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#818cf8]/15 text-[#818cf8] border border-[#818cf8]/30">
									<Cpu className="size-4" />
								</span>
								<div>
									<p className="font-display text-sm font-semibold text-white">
										Next: Experience &amp; Career
									</p>
									<p className="font-mono text-[11px] text-white/50">
										Detailed timeline with metrics, tech stacks &amp; impact
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={() => scrollToId("experience")}
								className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98]"
							>
								<span>Scroll to Experience</span>
								<ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5 text-[#6366f1]" />
							</button>
						</motion.div>
					</div>
				</div>

				{/* ==================================================================== */}
				{/* STATS BENTO ROW (Interactive Glass Cards with Hover Accents)         */}
				{/* ==================================================================== */}
				<div className="mt-20 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((stat, i) => (
						<TiltCard key={stat.label} max={6} className="h-full">
							<div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/25 hover:bg-black/60 shadow-lg">
								{/* Top tag */}
								<div className="flex items-center justify-between">
									<span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
										{stat.tag}
									</span>
									<span className="font-mono text-[10px] text-white/30">
										0{i + 1}
									</span>
								</div>

								{/* Metric CountUp */}
								<div className="my-6">
									<p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white group-hover:text-[#38bdf8] transition-colors duration-300">
										<CountUp value={stat.value} suffix={stat.suffix} />
									</p>
									<p className="font-mono text-xs uppercase tracking-wider text-white/80 mt-2 font-medium">
										{stat.label}
									</p>
								</div>

								{/* Description footer */}
								<p className="text-xs leading-relaxed text-white/50 border-t border-white/5 pt-3">
									{stat.desc}
								</p>

								{/* Subtle corner glow on hover */}
								<span
									aria-hidden
									className="pointer-events-none absolute -right-12 -bottom-12 size-32 rounded-full bg-gradient-to-br from-[#38bdf8]/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
								/>
							</div>
						</TiltCard>
					))}
				</div>
			</Container>
		</section>
	);
}
