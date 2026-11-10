import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
} from "framer-motion";
import { ArrowUpRight, LogIn, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { scrollToId, scrollToTop } from "#/components/immersive/SmoothScroll";
import { EASE } from "#/components/immersive/ui";
import PresenceBadge from "./PresenceBadge";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
	label: string;
	/** Route used outside the home page. */
	to: "/" | "/projects" | "/experience" | "/certificates";
	/** Section id on the home page. */
	section?: string;
};

const NAV_ITEMS: NavItem[] = [
	{ label: "Home", to: "/", section: "top" },
	{ label: "Projects", to: "/projects", section: "projects" },
	{ label: "Experience", to: "/experience", section: "experience" },
	{ label: "Certificates", to: "/certificates", section: "certificates" },
];

const MENU_OPEN_CLASS = "data-menu-open";

function useScrollLock(locked: boolean) {
	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle(MENU_OPEN_CLASS, locked);
		return () => root.classList.remove(MENU_OPEN_CLASS);
	}, [locked]);
}

/** Scroll-spy for the home page; other routes fall back to the pathname. */
function useActiveSection(enabled: boolean): string {
	const [section, setSection] = useState("top");

	useEffect(() => {
		if (!enabled) return;
		const ids = ["top", "about", "experience", "projects", "skills", "certificates", "contact"];

		const onScroll = () => {
			if (window.scrollY < 220) {
				setSection("top");
			}
		};
		window.addEventListener("scroll", onScroll, { passive: true });

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
						setSection(entry.target.id);
					}
				}
			},
			{ rootMargin: "-20% 0px -30% 0px", threshold: [0.1, 0.4] },
		);
		for (const id of ids) {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		}
		return () => {
			window.removeEventListener("scroll", onScroll);
			observer.disconnect();
		};
	}, [enabled]);

	return section;
}

export default function Header() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const isHome = pathname === "/";
	const activeSection = useActiveSection(isHome);
	const reduced = useReducedMotion();
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	const { scrollY, scrollYProgress } = useScroll();
	useMotionValueEvent(scrollY, "change", (value) => {
		setScrolled(value > 24);
	});

	useScrollLock(mobileOpen);

	// Close the overlay on route changes and Escape.
	const lastPathRef = useRef(pathname);
	useEffect(() => {
		if (lastPathRef.current === pathname) return;
		lastPathRef.current = pathname;
		setMobileOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!mobileOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMobileOpen(false);
				menuButtonRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [mobileOpen]);

	const activeLabel = (() => {
		if (!isHome) {
			const match = NAV_ITEMS.find(
				(item) =>
					item.to !== "/" &&
					(pathname === item.to || pathname.startsWith(`${item.to}/`)),
			);
			return match?.label ?? "Home";
		}
		if (activeSection === "projects") return "Projects";
		if (activeSection === "experience") return "Experience";
		if (activeSection === "certificates") return "Certificates";
		return "Home";
	})();

	const go = useCallback(
		(item: NavItem) => {
			setMobileOpen(false);
			if (isHome && item.section) {
				if (item.section === "top") scrollToTop();
				else scrollToId(item.section);
				return;
			}
			navigate({ to: item.to });
		},
		[isHome, navigate],
	);

	return (
		<>
			{/* Reading progress: one thin gradient line at the very top. */}
			<motion.div
				aria-hidden
				className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#6366f1] via-[#2dd4bf] to-[#6ee7b7]"
				style={{ scaleX: reduced ? 1 : scrollYProgress }}
			/>

			<header className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top))] z-50 flex justify-center px-3 sm:px-4">
				<motion.nav
					aria-label="Primary"
					className="pointer-events-auto flex w-full max-w-[1080px] items-center gap-2 rounded-full border border-black/10 bg-white/80 px-2 py-1.5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#080c16]/80"
					animate={{ paddingTop: scrolled ? 6 : 8, paddingBottom: scrolled ? 6 : 8 }}
					transition={{ duration: 0.4, ease: EASE }}
				>
					<Link
						to="/"
						aria-label="Vert San, home"
						onClick={(event) => {
							if (isHome) {
								event.preventDefault();
								scrollToTop();
							}
						}}
						className="shrink-0 rounded-full px-3 py-1.5 font-display text-base font-semibold tracking-tight text-foreground"
					>
						Vert
						<span className="bg-gradient-to-r from-[#6366f1] to-[#2dd4bf] bg-clip-text text-transparent">
							.
						</span>
					</Link>

					{/* Desktop links with a single sliding indicator. */}
					<ul className="hidden items-center gap-0.5 md:flex">
						{NAV_ITEMS.map((item) => {
							const isActive = activeLabel === item.label;
							return (
								<li key={item.label}>
									<button
										type="button"
										onClick={() => go(item)}
										aria-current={isActive ? "page" : undefined}
										className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
											isActive
												? "text-foreground"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										{isActive && (
											<motion.span
												layoutId="nav-active"
												className="absolute inset-0 -z-10 rounded-full bg-black/[0.06] dark:bg-white/[0.09]"
												transition={{ type: "spring", stiffness: 380, damping: 32 }}
											/>
										)}
										{item.label}
									</button>
								</li>
							);
						})}
					</ul>

					<div className="ml-auto flex items-center gap-1">
						<PresenceBadge />
						<ThemeToggle />
						<Link
							to="/login"
							className="hidden items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-black/10 hover:text-foreground md:inline-flex dark:hover:border-white/10"
						>
							<LogIn className="size-3.5" />
							Login
						</Link>

						<button
							ref={menuButtonRef}
							type="button"
							onClick={() => setMobileOpen((open) => !open)}
							aria-expanded={mobileOpen}
							aria-controls="mobile-menu"
							aria-label={mobileOpen ? "Close menu" : "Open menu"}
							className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5 md:hidden dark:hover:bg-white/10"
						>
							{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
						</button>
					</div>
				</motion.nav>
			</header>

			{/* Full-screen mobile menu with staggered links. */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						id="mobile-menu"
						role="dialog"
						aria-modal="true"
						aria-label="Site menu"
						className="fixed inset-0 z-40 flex flex-col justify-between bg-[#05070d]/95 px-6 pb-10 pt-28 text-[#eef1f7] backdrop-blur-2xl md:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.35, ease: EASE }}
					>
						<motion.ul
							className="space-y-1"
							initial="hidden"
							animate="show"
							variants={{
								hidden: {},
								show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
							}}
						>
							{NAV_ITEMS.map((item) => (
								<motion.li
									key={item.label}
									variants={{
										hidden: { opacity: 0, y: 22 },
										show: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.6, ease: EASE },
										},
									}}
								>
									<button
										type="button"
										onClick={() => go(item)}
										className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left font-display text-4xl font-medium tracking-tight"
									>
										{item.label}
										<ArrowUpRight className="size-5 text-[#6ee7b7]" />
									</button>
								</motion.li>
							))}
						</motion.ul>

						<motion.div
							className="space-y-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.5 }}
						>
							<Link
								to="/login"
								onClick={() => setMobileOpen(false)}
								className="inline-flex items-center gap-2 text-sm text-white/70"
							>
								<LogIn className="size-4" />
								Login
							</Link>
							<p className="mono-label text-white/35">Phnom Penh, Cambodia</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
