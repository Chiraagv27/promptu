import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/providers";
import { getSystemPrompt } from "@/lib/prompts";
import type { OptimizeMode } from "@/lib/prompts";

const DELIMITER = "---EXPLANATION---";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, mode = "better", apiKey } = body as {
      prompt?: string;
      mode?: OptimizeMode;
      apiKey?: string;
    };

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Missing or empty prompt" },
        { status: 400 }
      );
    }

    const model = getModel(apiKey ?? null);
    const systemPrompt = getSystemPrompt(mode ?? "better");

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt,
    });

    const idx = text.indexOf(DELIMITER);
    const optimizedText =
      idx >= 0 ? text.slice(0, idx).trim() : text.trim();
    const explanation =
      idx >= 0 ? text.slice(idx + DELIMITER.length).trim() : "";

    return NextResponse.json({
      optimizedText,
      explanation,
      mode: mode ?? "better",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Optimization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
