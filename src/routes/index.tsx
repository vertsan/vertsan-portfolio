import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AboutStatement from "#/components/immersive/AboutStatement";
import CertificatesMasonry from "#/components/immersive/CertificatesMasonry";
import ContactSection from "#/components/immersive/ContactSection";
import ExperienceTimeline from "#/components/immersive/ExperienceTimeline";
import HeroImmersive from "#/components/immersive/HeroImmersive";
import ProjectsGallery from "#/components/immersive/ProjectsGallery";
import SceneCanvas from "#/components/immersive/scene/SceneCanvas";
import { SceneProvider } from "#/components/immersive/scene/SceneContext";
import SkillsSphere from "#/components/immersive/SkillsSphere";
import ResumeAssistant from "#/components/ResumeAssistant";
import { DataProvider, type InitialData } from "#/lib/data-context";

const EMPTY: InitialData = {
	projects: [],
	jobs: [],
	education: [],
	certificates: [],
	technologies: [],
};

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const [data, setData] = useState<InitialData>(EMPTY);

	useEffect(() => {
		fetch("/api/public", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}",
		})
			.then((r) => r.json())
			.then((json) => {
				if (!json.error) setData(json);
			})
			.catch(() => {});
	}, []);

	return (
		<SceneProvider>
			<DataProvider data={data}>
				<div className="immersive relative min-h-screen">
					{/* Shared grain plate: sits above the canvas, below the content. */}
					<div aria-hidden className="immersive-noise" />
					<SceneCanvas />

					<main className="relative z-10">
						<HeroImmersive />
						<AboutStatement />
						<ExperienceTimeline />
						<ProjectsGallery />
						<SkillsSphere />
						<CertificatesMasonry />
						<ContactSection />
					</main>

					<ResumeAssistant />
				</div>
			</DataProvider>
		</SceneProvider>
	);
}
