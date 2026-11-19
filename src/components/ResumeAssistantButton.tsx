import { Briefcase, ChevronRight } from "lucide-react";
import { Button } from "#/components/ui/button";
import { showResumeAssistant } from "./ResumeAssistant";

export default function RemyButton() {
	return (
		<div className="px-2 mb-2 w-full">
			<Button
				type="button"
				variant="ghost"
				onClick={() => showResumeAssistant.setState(() => true)}
				className="flex w-full justify-between bg-linear-to-r from-blue-500 to-purple-800 text-white transition-opacity"
				aria-label="Open Resume Assistant"
			>
				<div className="flex items-center gap-2">
					<Briefcase className="size-6" />
					<span className="text-sm">Resume Assistant</span>
				</div>
				<ChevronRight className="size-4" />
			</Button>
		</div>
	);
}
