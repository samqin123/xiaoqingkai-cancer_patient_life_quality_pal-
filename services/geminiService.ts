
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

/**
 * Generates a response from the Gemini assistant based on user query and profile.
 * Follows the latest @google/genai guidelines.
 */
export const getAssistantResponse = async (
  query: string,
  category: string,
  userProfile: UserProfile,
  history: ChatMessage[]
): Promise<{ text: string; sources: Array<{ title: string; uri: string }> }> => {
  try {
    // Fix: Initialize GoogleGenAI with a named parameter and use process.env.API_KEY directly.
    // Assume the API key is pre-configured in the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userContext = `用户昵称: ${userProfile.name}, 癌种: ${userProfile.cancerType}, 当前状态: ${userProfile.treatmentStatus}, 咨询专题: ${category}`;

    // Fix: Use ai.models.generateContent directly and structure contents as required.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `${userContext}\n提问内容: ${query}` }] },
      config: {
        systemInstruction: "你是一位专业且充满同理心的抗癌管家。请始终使用中文，语调要温暖而坚定。回答结构：【核心结论】、【深度解析】、【温情寄语】。严禁使用 Markdown。",
        temperature: 0.7,
      },
    });

    // Fix: Access response.text as a property, not a method.
    return {
      text: response.text || "抱歉，我现在思绪有点乱，能请您换个方式问我吗？",
      sources: []
    };
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    const errorMsg = error.message?.includes('fetch') ? "网络连接不太顺畅，请检查您的网络设置后再试。" : "AI 服务暂时休眠中，请稍后再试。";
    return { text: errorMsg, sources: [] };
  }
};
