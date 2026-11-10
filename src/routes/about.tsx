import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "#/components/sections/HeroSection";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return <HeroSection />;
}
