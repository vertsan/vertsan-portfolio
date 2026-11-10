import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { useRef } from "react";
import { certificates, type CertificateEntry } from "#/data/certificates";
import { useLiveContent } from "#/lib/useLiveContent";
import { useSceneSection } from "./scene/SceneContext";
import { Container, Glow, Reveal, SectionLabel, TiltCard } from "./ui";

interface LiveCertificate {
	title: string;
	issuer: string;
	date: string;
	summary: string;
	credentialUrl?: string | null;
	tags: string[];
}

interface CardItem extends CertificateEntry {
	live: boolean;
}

const ACCENTS = ["#f59e0b", "#2dd4bf", "#818cf8", "#6ee7b7", "#38bdf8", "#f472b6"];

function fromLive(certificate: LiveCertificate, index: number): CardItem {
	return {
		id: `live-${index}-${certificate.title}`,
		title: certificate.title,
		issuer: certificate.issuer,
		date: certificate.date,
		summary: certificate.summary,
		credentialUrl: certificate.credentialUrl ?? undefined,
		tags: certificate.tags ?? [],
		accent: ACCENTS[index % ACCENTS.length] ?? "#818cf8",
		live: true,
	};
}

function CertificateCard({ item }: { item: CardItem }) {
	return (
		<TiltCard max={5} className="mb-5 break-inside-avoid rounded-3xl">
			<article className="group glass relative overflow-hidden p-6">
				<span
					aria-hidden
					className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-90"
					style={{
						background: `radial-gradient(circle, ${item.accent}55, transparent 70%)`,
					}}
				/>

				<div className="flex items-start justify-between gap-4">
					{/* Monogram plate instead of a stock seal graphic. */}
					<span
						className="flex size-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold"
						style={{
							borderColor: `${item.accent}44`,
							background: `${item.accent}14`,
							color: item.accent,
						}}
						aria-hidden
					>
						{item.issuer.slice(0, 2).toUpperCase()}
					</span>
					<span className="mono-label pt-1 text-[var(--i-subtle)]">{item.date}</span>
				</div>

				<h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-[-0.01em]">
					{item.title}
				</h3>
				<p className="mt-1.5 text-xs text-[var(--i-subtle)]">{item.issuer}</p>
				<p className="mt-4 text-sm leading-relaxed text-[var(--i-muted)]">
					{item.summary}
				</p>

				<div className="mt-5 flex flex-wrap items-center gap-1.5">
					{item.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full border border-[var(--i-line)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--i-subtle)]"
						>
							{tag}
						</span>
					))}
				</div>

				{item.credentialUrl && (
					<a
						href={item.credentialUrl}
						target="_blank"
						rel="noreferrer"
						className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--i-muted)] transition-colors hover:text-[var(--i-fg)]"
					>
						<BadgeCheck aria-hidden className="size-3.5 text-[#6ee7b7]" />
						Verify credential
						<ArrowUpRight
							aria-hidden
							className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</a>
				)}
			</article>
		</TiltCard>
	);
}

export default function CertificatesMasonry() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const { items } = useLiveContent<LiveCertificate>("certificates");
	const cards: CardItem[] =
		items.length > 0
			? items.map(fromLive)
			: certificates.map((certificate) => ({ ...certificate, live: false }));

	useSceneSection(sectionRef, "certificates", "#6ee7b7");

	return (
		<section
			ref={sectionRef}
			id="certificates"
			aria-labelledby="certificates-heading"
			className="relative overflow-visible py-24 sm:py-32"
		>
			<Glow className="-right-40 bottom-10 size-[34rem] opacity-50" color="rgba(110,231,183,0.16)" />

			<Container>
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div>
						<SectionLabel>Certificates</SectionLabel>
						<h2
							id="certificates-heading"
							className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl"
						>
							<Reveal>Proof of the</Reveal>
							<Reveal delay={0.08}>
								<span className="immersive-gradient-text">boring parts.</span>
							</Reveal>
						</h2>
					</div>
					<Link
						to="/certificates"
						className="group inline-flex items-center gap-2 text-sm text-[var(--i-muted)] transition-colors hover:text-[var(--i-fg)]"
					>
						All certificates
						<ArrowUpRight
							aria-hidden
							className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</Link>
				</div>

				<motion.div
					initial={reduced ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-8% 0px" }}
					transition={{ duration: 0.7 }}
					className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3"
				>
					{cards.map((item) => (
						<CertificateCard key={item.id} item={item} />
					))}
				</motion.div>
			</Container>
		</section>
	);
}
