import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModelV3 } from "@ai-sdk/provider";

const DEFAULT_MODEL = "gemini-2.0-flash";

export function getModel(apiKey?: string | null): LanguageModelV3 {
  const key = apiKey ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing Gemini API key. Set GOOGLE_GENERATIVE_AI_API_KEY or pass apiKey in request.");
  }
  return createGoogleGenerativeAI({ apiKey: key }).languageModel(DEFAULT_MODEL);
}
