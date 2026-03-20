'use client';

import { startTransition, useState, useEffect } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { OptimizationMode, Provider } from '@/lib/types';

interface FeedbackButtonsProps {
  sessionId: string | null;
  mode: OptimizationMode;
  provider: Provider;
  inputLength: number;
  outputLength: number;
  disabled: boolean;
  onSubmitted?: () => void;
}

export function FeedbackButtons({
  sessionId,
  mode,
  provider,
  inputLength,
  outputLength,
  disabled,
  onSubmitted,
}: FeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      setSubmitted(false);
      setError(null);
    });
  }, [sessionId]);

  const sendFeedback = async (feedback: 'up' | 'down') => {
    if (!sessionId || submitted) return;
    setError(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          provider,
          inputLength,
          outputLength,
          feedback,
          sessionId,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (res.ok) {
        setSubmitted(true);
        onSubmitted?.();
      } else {
        setError(data.error || 'Failed to send feedback');
      }
    } catch {
      setError('Failed to send feedback');
    }
  };

  const isDisabled = disabled || submitted;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => sendFeedback('up')}
          disabled={isDisabled}
          aria-label="Thumbs up"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent p-1 text-[#555] transition-colors duration-200 ease-out hover:text-[#22c55e] disabled:opacity-50"
        >
          <ThumbsUp className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => sendFeedback('down')}
          disabled={isDisabled}
          aria-label="Thumbs down"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent p-1 text-[#555] transition-colors duration-200 ease-out hover:text-[#ef4444] disabled:opacity-50"
        >
          <ThumbsDown className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
        {submitted && (
          <span className="text-sm text-green-500/90">Thanks for your feedback!</span>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
