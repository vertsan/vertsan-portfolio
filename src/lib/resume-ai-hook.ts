import type { InferChatMessages } from "@tanstack/ai-react";
import {
	createChatClientOptions,
	fetchServerSentEvents,
	useChat,
} from "@tanstack/ai-react";

const chatOptions = createChatClientOptions({
	connection: fetchServerSentEvents("/api/resume-chat"),
	threadId: "resume-assistant",
});

export type ResumeChatMessages = InferChatMessages<typeof chatOptions>;

export const useResumeChat = () => useChat(chatOptions);
