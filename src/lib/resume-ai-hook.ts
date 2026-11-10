import type { InferChatMessages } from "@tanstack/ai-react";
import {
	createChatClientOptions,
	fetchServerSentEvents,
	useChat,
} from "@tanstack/ai-react";

// Default chat options for type inference
const defaultChatOptions = createChatClientOptions({
	connection: fetchServerSentEvents("/api/resume-chat"),
	threadId: "resume-assistant",
});

export type ResumeChatMessages = InferChatMessages<typeof defaultChatOptions>;

export const useResumeChat = () => {
	const chatOptions = createChatClientOptions({
		connection: fetchServerSentEvents("/api/resume-chat"),
		threadId: "resume-assistant",
	});

	return useChat(chatOptions);
};
