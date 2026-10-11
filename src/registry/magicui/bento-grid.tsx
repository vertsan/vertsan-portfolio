import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
	name: string;
	className: string;
	background: ReactNode;
	Icon: ElementType;
	description: string;
	href: string;
	cta: string;
}

function BentoGrid({
	children,
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={cn(
				"grid w-full auto-rows-[18rem] grid-cols-3 gap-4",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

/**
 * Internal routes (starting with "/") navigate with the router so the page
 * isn't reloaded; everything else keeps a regular anchor.
 */
function CtaLink({ href, children }: { href: string; children: ReactNode }) {
	if (href.startsWith("/") && !href.startsWith("//")) {
		return <Link to={href}>{children}</Link>;
	}
	return <a href={href}>{children}</a>;
}

function BentoCard({
	name,
	className,
	background,
	Icon,
	description,
	href,
	cta,
	...props
}: BentoCardProps) {
	return (
		<div
			className={cn(
				"group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
				// light styles
				"bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
				// dark styles
				"transform-gpu dark:bg-background dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
				className,
			)}
			{...props}
		>
			<div>{background}</div>
			<div className="p-4">
				<div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
					<Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75 dark:text-neutral-200" />
					<h3 className="line-clamp-2 text-xl font-semibold text-neutral-700 dark:text-neutral-100">
						{name}
					</h3>
					<p className="line-clamp-2 max-w-lg text-neutral-400 dark:text-neutral-300">
						{description}
					</p>
				</div>

				<div className="pointer-events-none flex w-full translate-y-0 flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
					<Button
						variant="link"
						asChild
						size="sm"
						className="pointer-events-auto p-0"
					>
						<CtaLink href={href}>
							{cta}
							<ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
						</CtaLink>
					</Button>
				</div>
			</div>

			<div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
				<Button
					variant="link"
					asChild
					size="sm"
					className="pointer-events-auto p-0"
				>
					<CtaLink href={href}>
						{cta}
						<ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
					</CtaLink>
				</Button>
			</div>

			<div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/3 group-hover:dark:bg-neutral-800/10" />
		</div>
	);
}

export { BentoCard, BentoGrid };