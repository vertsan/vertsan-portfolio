import type { CSSProperties } from "react";

/** Origin palette from the React Bits GradientASCII docs. */
export const GRADIENT_ASCII_COLORS: string[] = [
	"#1e3fd8",
	"#f6f8ff",
	"#a5d8ff",
	"#38bdf8",
];

/** Fades the ASCII field into the page background at the bottom. */
export const ASCII_FADE_MASK: CSSProperties = {
	maskImage:
		"linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
	WebkitMaskImage:
		"linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 55%, transparent 100%)",
};
