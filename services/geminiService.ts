
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

export const getAssistantResponse = async (
  query: string,
  category: string,
  userProfile: UserProfile,
  history: ChatMessage[]
): Promise<{ text: string; sources: Array<{ title: string; uri: string }> }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return { text: "由于系统未配置有效的 API 密钥，小青暂时无法连接大脑。请在设置中检查配置。", sources: [] };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const userContext = `用户昵称: ${userProfile.name}, 癌种: ${userProfile.cancerType}, 当前状态: ${userProfile.treatmentStatus}, 咨询专题: ${category}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${userContext}\n提问内容: ${query}` }] }],
      config: {
        systemInstruction: "你是一位专业且充满同理心的抗癌管家。请始终使用中文，语调要温暖而坚定。回答结构：【核心结论】、【深度解析】、【温情寄语】。严禁使用 Markdown。",
        temperature: 0.7,
      },
    });

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
