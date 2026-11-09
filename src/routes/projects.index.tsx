import { createFileRoute } from "@tanstack/react-router";
import ProjectsSection from "#/components/sections/ProjectsSection";
import AsciiBackdrop from "#/components/ui/ascii-backdrop";

export const Route = createFileRoute("/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative overflow-hidden">
			<AsciiBackdrop className="inset-x-0 top-0 z-0 h-48" />
			<div className="relative z-10">
				<ProjectsSection />
			</div>
		</div>
	);
}
