import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import { certificates } from "#/data/certificates";
import { experience, yearsOfExperience } from "#/data/experience";
import { profile } from "#/data/profile";
import { projects } from "#/data/projects";
import { useSceneSection } from "./scene/SceneContext";
import { Container, CountUp, Glow, Reveal, ScrollWords, SectionLabel } from "./ui";

const stats = [
	{ label: "Years building", value: yearsOfExperience(experience) },
	{ label: "Projects shipped", value: projects.length },
	{ label: "Users reached", value: profile.usersReached, suffix: "+" },
	{ label: "Certificates", value: certificates.length },
];

export default function AboutStatement() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start 0.95", "end 0.35"],
	});

	useSceneSection(sectionRef, "about", "#6366f1");

	return (
		<section
			ref={sectionRef}
			id="about"
			aria-labelledby="about-heading"
			className="relative overflow-visible py-24 sm:py-32"
		>
			<Glow className="-right-40 top-24 size-[32rem] opacity-70" />

			<Container>
				<div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
					<div className="col-span-12 lg:col-span-4">
						<div className="lg:sticky lg:top-32">
							<SectionLabel>About me</SectionLabel>
							<h2
								id="about-heading"
								className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl"
							>
								<Reveal>Quiet systems.</Reveal>
								<Reveal delay={0.08}>
									<span className="immersive-gradient-text">Loud results.</span>
								</Reveal>
							</h2>
							<p className="mt-6 max-w-xs text-sm leading-relaxed text-[var(--i-subtle)]">
								Based in {profile.location}. Currently{" "}
								{profile.availability.toLowerCase()}.
							</p>
						</div>
					</div>

					<div className="col-span-12 lg:col-span-8">
						<ScrollWords
							text={profile.statement}
							progress={scrollYProgress}
							className="max-w-[26ch] text-pretty font-display text-[clamp(1.6rem,3.4vw,2.9rem)] font-medium leading-[1.24] tracking-[-0.02em] sm:max-w-[30ch]"
						/>

						<motion.div
							initial={reduced ? false : { opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.05, margin: "0px 0px 40px 0px" }}
							transition={{ duration: 0.7, delay: 0.1 }}
							className="mt-12 max-w-xl space-y-4 text-sm leading-relaxed text-[var(--i-muted)] sm:text-base"
						>
							<p>
								I care about the unglamorous parts: typed boundaries, honest
								loading states, keyboard paths, and queries that stay fast as
								the table grows. Most of my work sits between a design file and
								a production database.
							</p>
							<p>
								When I am not shipping, I am reading about security, tuning
								interfaces until they feel effortless, or rebuilding this site
								for the fourth time.
							</p>
						</motion.div>
					</div>
				</div>

				<div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[var(--i-line)] bg-[var(--i-line)] sm:mt-20 lg:grid-cols-4">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="bg-[var(--i-bg)]/85 px-6 py-8 backdrop-blur-md sm:px-8 sm:py-10"
						>
							<p className="font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
								<CountUp value={stat.value} suffix={stat.suffix ?? ""} />
							</p>
							<p className="mono-label mt-3 text-[var(--i-subtle)]">{stat.label}</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
