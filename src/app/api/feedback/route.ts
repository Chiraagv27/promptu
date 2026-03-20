import { normalizeModeForDb } from '@/lib/optimization-logs';
import { getSupabaseClient } from '@/lib/supabase';

export const runtime = 'nodejs';

function isMissingColumnError(message: string): boolean {
  return /Could not find the '.*' column of 'optimization_logs' in the schema cache/i.test(
    message,
  );
}

export async function POST(req: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const {
    mode,
    provider,
    inputLength,
    outputLength,
    feedback,
    sessionId,
  } = (await req.json()) as {
    mode?: string;
    provider?: string;
    inputLength?: number;
    outputLength?: number;
    feedback?: string;
    sessionId?: string;
  };

  if (!mode || typeof mode !== 'string') {
    return Response.json({ error: 'mode is required' }, { status: 400 });
  }
  if (!feedback || typeof feedback !== 'string') {
    return Response.json({ error: 'feedback is required' }, { status: 400 });
  }
  if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
    return Response.json({ error: 'sessionId is required' }, { status: 400 });
  }

  const sid = sessionId.trim();
  const normalizedMode = normalizeModeForDb(mode);
  const prov = typeof provider === 'string' && provider.trim() ? provider.trim() : 'gemini';
  const pl = typeof inputLength === 'number' && !Number.isNaN(inputLength) ? inputLength : 0;
  const ol = typeof outputLength === 'number' && !Number.isNaN(outputLength) ? outputLength : 0;

  const updatePayload = {
    feedback,
    mode: normalizedMode,
    provider: prov,
    model: prov,
    prompt_length: pl,
    optimized_length: ol,
  };

  const updated = await supabase
    .from('optimization_logs')
    .update(updatePayload)
    .eq('session_id', sid)
    .select('id');

  if (updated.error) {
    if (isMissingColumnError(updated.error.message)) {
      // Use `feedback` text only — integer rating 1/-1 often violates
      // optimization_logs_rating_check (e.g. 1–5 star scales forbid -1).
      const fb = feedback === 'up' ? 'up' : 'down';
      const narrow = await supabase
        .from('optimization_logs')
        .update({ feedback: fb })
        .eq('session_id', sid)
        .select('id');
      if (!narrow.error && narrow.data && narrow.data.length > 0) {
        return Response.json({ success: true, updated: true });
      }
      const legacy = await supabase.from('optimization_logs').insert({
        session_id: sid,
        mode: normalizedMode,
        provider: prov,
        model: prov,
        feedback: fb,
      });
      if (legacy.error) return Response.json({ error: legacy.error.message }, { status: 500 });
      return Response.json({ success: true, legacy: true });
    }
    return Response.json({ error: updated.error.message }, { status: 500 });
  }

  if (updated.data && updated.data.length > 0) {
    return Response.json({ success: true, updated: true });
  }

  const insertRow = {
    session_id: sid,
    mode: normalizedMode,
    version: 'v1' as const,
    provider: prov,
    model: prov,
    prompt_length: pl,
    optimized_length: ol,
    explanation_length: 0,
    feedback,
  };

  const inserted = await supabase.from('optimization_logs').insert(insertRow);

  if (inserted.error) {
    if (isMissingColumnError(inserted.error.message)) {
      const fb = feedback === 'up' ? 'up' : 'down';
      const legacy = await supabase.from('optimization_logs').insert({
        session_id: sid,
        mode: normalizedMode,
        provider: prov,
        model: prov,
        feedback: fb,
      });
      if (legacy.error) return Response.json({ error: legacy.error.message }, { status: 500 });
      return Response.json({ success: true, legacy: true });
    }
    return Response.json({ error: inserted.error.message }, { status: 500 });
  }

  return Response.json({ success: true, inserted: true });
}
