import { useEffect, useState } from "react";

const DAYS_PER_YEAR = 365.2425;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Elapsed years since a date, formatted to nine decimal places. */
export function formatElapsedYears(birthDate: Date, now: Date): string {
	const elapsedMs = Math.max(0, now.getTime() - birthDate.getTime());
	return (elapsedMs / MS_PER_DAY / DAYS_PER_YEAR).toFixed(9);
}

/**
 * Live elapsed years from a birth date.
 *
 * Updates on every animation frame so the nine-decimal value ticks visibly.
 * Returns `null` on the server and on the first client render to keep hydration
 * deterministic. The frame loop is cancelled on unmount.
 */
export function useElapsedYears(birthDate: Date): string | null {
	const [years, setYears] = useState<string | null>(null);

	useEffect(() => {
		let frame = 0;

		const tick = () => {
			setYears(formatElapsedYears(birthDate, new Date()));
			frame = window.requestAnimationFrame(tick);
		};

		frame = window.requestAnimationFrame(tick);
		return () => window.cancelAnimationFrame(frame);
	}, [birthDate]);

	return years;
}
