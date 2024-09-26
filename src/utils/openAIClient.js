import OpenAI from "openai";

const createOpenAIClient = (userEmail) => {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": import.meta.env.VITE_SITE_URL,
      "X-Title": import.meta.env.VITE_SITE_NAME,
      "X-User-Email": userEmail,
    }
  });
};

export const generateAIResponse = async (prompt, userEmail) => {
  try {
    const openai = createOpenAIClient(userEmail);
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen-2-vl-7b-instruct:free",
      messages: [
        { role: "user", content: prompt }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};

export default createOpenAIClient;
