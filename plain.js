const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Access your API key as an environment variable.
const genAI = new GoogleGenerativeAI("AIzaSyD6zQ0Ag9OJVeI5gd27JkwJeuMNHDiD7qw");

async function run() {
  // Choose a model that's appropriate for your use case.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Write a story about a magic backpack.";

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
}

run();
