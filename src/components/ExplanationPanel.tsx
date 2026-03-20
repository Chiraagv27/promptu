'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ExplanationPanelProps {
  explanation: string;
}

function isBulletLine(line: string): boolean {
  const t = line.trim();
  return /^[-*•]\s+\S/.test(t) || /^\d+[.)]\s+\S/.test(t);
}

function stripBullet(line: string): string {
  return line.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, '').trim();
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const trimmed = explanation.trim();
  if (!trimmed) return null;

  const lines = trimmed
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const allBullets = lines.length > 0 && lines.every(isBulletLine);

  return (
    <div className="rounded-[12px] border border-[#1e1e1e] bg-[#0d0d0d] px-6 py-5 transition-colors duration-200 ease-out">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between text-left transition hover:bg-[#111]/50"
      >
        <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-[#666]">
          What changed and why
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#666]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[#666]" />
        )}
      </button>
      {expanded && (
        <div className="mt-4 border-t border-[#1e1e1e] pt-4">
          {allBullets ? (
            <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-[1.7] text-[#aaa] marker:text-[#666]">
              {lines.map((line, i) => (
                <li key={i}>{stripBullet(line)}</li>
              ))}
            </ul>
          ) : lines.length === 1 ? (
            <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-[#aaa]">
              {lines[0]}
            </p>
          ) : (
            <div className="whitespace-pre-wrap text-[14px] leading-[1.7] text-[#aaa]">
              {trimmed}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
