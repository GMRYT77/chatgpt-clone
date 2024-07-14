import openai from "./chatgpt";

const query = async (prompt, chatId, model) => {
  const res = await openai.chat.completions
    .create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      top_p: 1,
      max_token: 256,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) => `ChatGPT was unable to find an answer (Error: ${err.message})`
    );

  return res;
};
export default query;
