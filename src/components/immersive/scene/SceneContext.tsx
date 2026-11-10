import { useInView } from "framer-motion";
import {
	createContext,
	type RefObject,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type SceneMode =
	| "hero"
	| "about"
	| "experience"
	| "projects"
	| "skills"
	| "certificates"
	| "contact";

export interface SceneTarget {
	mode: SceneMode;
	accent: string;
}

export type SceneQuality = "high" | "low";

interface SceneState {
	target: SceneTarget;
	setTarget: (target: SceneTarget) => void;
	ready: boolean;
	setReady: (ready: boolean) => void;
	quality: SceneQuality;
	setQuality: (quality: SceneQuality) => void;
	isMobile: boolean;
}

const FALLBACK: SceneState = {
	target: { mode: "hero", accent: "#818cf8" },
	setTarget: () => {},
	ready: false,
	setReady: () => {},
	quality: "high",
	setQuality: () => {},
	isMobile: false,
};

const SceneContext = createContext<SceneState>(FALLBACK);

export function SceneProvider({ children }: { children: React.ReactNode }) {
	const [target, setTargetState] = useState<SceneTarget>(FALLBACK.target);
	const [ready, setReady] = useState(false);
	const [quality, setQuality] = useState<SceneQuality>("high");
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(max-width: 767px)");
		const sync = () => setIsMobile(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);

	const setTarget = useCallback((next: SceneTarget) => {
		setTargetState((current) =>
			current.mode === next.mode && current.accent === next.accent ? current : next,
		);
	}, []);

	const value = useMemo(
		() => ({
			target,
			setTarget,
			ready,
			setReady,
			quality,
			setQuality,
			isMobile,
		}),
		[target, setTarget, ready, quality, isMobile],
	);

	return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene(): SceneState {
	return useContext(SceneContext);
}

/**
 * Registers a section with the persistent scene. The observer margin keeps
 * only the section crossing the viewport's middle band "active", so the
 * portrait moves once per section instead of thrashing between neighbours.
 */
export function useSceneSection(
	ref: RefObject<HTMLElement | null>,
	mode: SceneMode,
	accent: string,
) {
	const { setTarget } = useScene();
	const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

	useEffect(() => {
		if (inView) setTarget({ mode, accent });
	}, [inView, mode, accent, setTarget]);
}
