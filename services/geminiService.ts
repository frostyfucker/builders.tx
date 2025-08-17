
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const chatConfig = {
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are an expert assistant for construction project management and navigating building permit processes.
    Provide clear, concise, and actionable advice.
    When asked about specific trades or steps, offer best practices, potential pitfalls, and typical timelines.
    Be friendly and professional.`,
  },
};

let chat: Chat | null = null;

const getChatInstance = (): Chat => {
    if (!chat) {
        chat = ai.chats.create(chatConfig);
    }
    return chat;
}

export const streamAIResponse = async (prompt: string) => {
    const chatInstance = getChatInstance();
    try {
        const result = await chatInstance.sendMessageStream({ message: prompt });
        return result;
    } catch (error) {
        console.error("Gemini API error:", error);
        // Reset chat on error
        chat = null; 
        throw new Error("Failed to get response from AI. The chat has been reset.");
    }
};
