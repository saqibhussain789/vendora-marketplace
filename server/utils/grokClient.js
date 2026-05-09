import OpenAI from "openai";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in server/.env");
}

const grokClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default grokClient;