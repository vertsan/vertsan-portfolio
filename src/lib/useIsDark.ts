import { useSyncExternalStore } from "react";

function readIsDark(): boolean {
	return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
	return false;
}

function subscribe(cb: () => void): () => void {
	const root = document.documentElement;
	const observer = new MutationObserver(cb);
	observer.observe(root, { attributes: true, attributeFilter: ["class"] });
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	media.addEventListener("change", cb);
	return () => {
		observer.disconnect();
		media.removeEventListener("change", cb);
	};
}

export function useIsDark(): boolean {
	return useSyncExternalStore(subscribe, readIsDark, getServerSnapshot);
}
