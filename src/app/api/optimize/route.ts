import { streamText } from 'ai';

import { splitOptimizedOutput } from '@/lib/delimiter';
import { normalizeModeForDb, parsePromptScore } from '@/lib/optimization-logs';
import { createProvider } from '@/lib/providers';
import { getSystemPrompt } from '@/lib/prompts';
import type { OptimizeMode } from '@/lib/prompts';
import { getSupabaseClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const SCORE_PATTERN = /---SCORE---\d{1,3}---/g;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      text?: string;
      mode?: OptimizeMode | string;
      apiKey?: string;
      session_id?: string;
      provider?: string;
    };

    const promptRaw =
      typeof body.text === 'string' && body.text.trim()
        ? body.text.trim()
        : typeof body.prompt === 'string'
          ? body.prompt.trim()
          : '';

    if (!promptRaw) {
      return Response.json({ error: 'Missing or empty prompt' }, { status: 400 });
    }

    const { mode = 'better', apiKey, session_id } = body;
    const sessionId =
      typeof session_id === 'string' ? session_id.trim() : '';
    const modeStr = typeof mode === 'string' ? mode : 'better';
    const dbMode = normalizeModeForDb(modeStr);

    const { model, modelId } = createProvider('gemini', apiKey ?? undefined);
    const systemPrompt = getSystemPrompt(modeStr);

    const result = streamText({
      model,
      system: systemPrompt,
      prompt: promptRaw,
      onFinish: async ({ text }) => {
        try {
          const { optimizedText: rawOpt, explanation, changes } =
            splitOptimizedOutput(text);
          const optimizedText = rawOpt.replace(SCORE_PATTERN, '').trim();
          const promptScore = parsePromptScore(text);

          if (sessionId) {
            const supabase = getSupabaseClient();
            if (supabase) {
              void supabase.from('optimization_logs').insert({
                session_id: sessionId,
                mode: dbMode,
                version: 'v1',
                provider: 'gemini',
                model: modelId,
                prompt_length: promptRaw.length,
                optimized_length: optimizedText.length,
                explanation_length: explanation.length + changes.length,
                ...(promptScore != null ? { prompt_score: promptScore } : {}),
              });
            }
          }
        } catch (logErr) {
          console.error('[api/optimize] onFinish logging error:', logErr);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error('[api/optimize]', err);
    const message = err instanceof Error ? err.message : 'Optimization failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
