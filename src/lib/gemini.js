const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyD6zQ0Ag9OJVeI5gd27JkwJeuMNHDiD7qw";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0,
  topP: 0.9,
  topK: 64,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

async function queryGemini({ prompt, chatId, session }) {
  if (!prompt) {
    return;
  }
  if (!chatId) {
    return;
  }
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
  });

  //   for await (const chunk of result.stream) {
  //     const chunkText = chunk.text();
  //     console.log(chunkText);
  //   }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}

export { queryGemini };
