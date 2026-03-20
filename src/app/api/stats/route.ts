import { getSupabaseClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json({
      total: 0,
      thumbsUp: 0,
      thumbsDown: 0,
      avgScore: null,
      byMode: {},
      byProvider: {},
    });
  }

  try {
    const { data: logs, error } = await supabase.from('optimization_logs').select('*');

    if (error) {
      console.error('[Stats API] Error fetching logs:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const rows = logs ?? [];
    const total = rows.length;
    const thumbsUp = rows.filter((r) => r.feedback === 'up' || r.rating === 1).length;
    const thumbsDown = rows.filter((r) => r.feedback === 'down' || r.rating === -1).length;

    const scored = rows.filter(
      (r) =>
        typeof r.prompt_score === 'number' &&
        !Number.isNaN(r.prompt_score as number),
    ) as { prompt_score: number }[];
    const avgScore =
      scored.length > 0
        ? Math.round(
            scored.reduce((acc, r) => acc + r.prompt_score, 0) / scored.length,
          )
        : null;

    const byMode = rows.reduce(
      (acc, r) => {
        const m = r.mode ?? 'unknown';
        acc[m] = (acc[m] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const byProvider = rows.reduce(
      (acc, r) => {
        const p = r.provider ?? 'unknown';
        acc[p] = (acc[p] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Response.json({
      total,
      thumbsUp,
      thumbsDown,
      avgScore,
      byMode,
      byProvider,
    });
  } catch (err) {
    console.error('[Stats API] Unexpected error:', err);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
