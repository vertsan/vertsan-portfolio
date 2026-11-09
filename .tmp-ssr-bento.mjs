import { createServer } from "vite";

const server = await createServer({
	server: { middlewareMode: true },
	appType: "custom",
});

try {
	const React = await import("react");
	const { renderToString } = await import("react-dom/server");
	const sectionMod = await server.ssrLoadModule(
		"/src/components/sections/BentoShowcaseSection.tsx",
	);
	const dataMod = await server.ssrLoadModule("/src/lib/data-context.tsx");

	const data = {
		projects: [
			{
				title: "Alpha Platform",
				slug: "alpha-platform",
				summary: "A live platform.",
				status: "Completed",
				startDate: "2025-01-01",
				image: "/images/alpha.jpg",
			},
			{
				title: "Beta App",
				slug: "beta-app",
				summary: "In development.",
				status: "In progress",
				startDate: "2024-06-01",
			},
		],
		jobs: [],
		education: [],
		certificates: [],
		technologies: [],
	};

	const html = renderToString(
		React.createElement(
			dataMod.DataProvider,
			{ data },
			React.createElement(sectionMod.default),
		),
	);

	console.log("length:", html.length);
	console.log("has magic-bento:", html.includes("magic-bento"));
	console.log("has alpha:", html.includes("Alpha Platform"));
	console.log("has href:", html.includes("/projects/alpha-platform"));
	console.log("has image:", html.includes("/images/alpha.jpg"));
	console.log("sample:", html.slice(0, 400));
} finally {
	await server.close();
}
