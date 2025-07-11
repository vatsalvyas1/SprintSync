import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export class GeminiService {
    constructor(apiKey) {
        this.apiKey = null;
        this.genAI = null;

        if (apiKey) {
            this.setupAPI(apiKey);
        }
    }

    setupAPI(apiKey) {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    isConfigured() {
        return !!this.genAI;
    }

    async generateContent(prompt, systemPrompt, imageData) {
        if (!this.genAI) {
            throw new Error(
                "Gemini API not configured. Please set your API key first."
            );
        }

        try {
            const model = this.genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
            });

            const chatSession = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }],
                    },
                    {
                        role: "model",
                        parts: [
                            {
                                text: "I understand the requirements for generating test cases. I'm ready to help create detailed, structured test cases based on your inputs.",
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                },
            });

            let parts = [{ text: prompt }];
            if (imageData) {
                // imageData is a base64 data URL, need to convert to { inlineData: { data, mimeType } }
                const match = imageData.match(
                    /^data:(image\/\w+);base64,(.+)$/
                );
                if (match) {
                    const mimeType = match[1];
                    const data = match[2];
                    parts.push({ inlineData: { data, mimeType } });
                }
            }

            const result = await chatSession.sendMessage(parts);
            const response = result.response;
            return response.text();
        } catch (error) {
            console.error("Error generating content:", error);
            throw new Error(
                "Failed to generate content. Please try again later."
            );
        }
    }
}

export const geminiService = new GeminiService(apiKey);
