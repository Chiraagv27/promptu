'use client';

import { Clipboard, Wand2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { LandingHeader } from '@/components/LandingHeader';

const steps = [
  {
    icon: Clipboard,
    label: 'Paste Prompt',
  },
  {
    icon: Wand2,
    label: 'Optimize',
  },
  {
    icon: Sparkles,
    label: 'Learn Why',
  },
];

export default function Page() {
  return (
    <main className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[#050505] font-sans text-[#ECECEC]">
      <LandingHeader />

      <div className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 py-16 sm:px-6 md:px-8 lg:px-10">
        <section className="mb-20 min-w-0 text-center md:mb-24">
          <h2 className="animate-fade-in bg-gradient-to-r from-[#ECECEC] via-zinc-300 to-[#ECECEC] bg-clip-text text-3xl font-semibold leading-tight tracking-tight text-transparent sm:text-4xl md:text-5xl">
            PromptPerfect
          </h2>
          <p className="animate-fade-in animate-fade-in-delay-1 mx-auto mt-4 max-w-2xl break-words px-1 text-base leading-relaxed text-zinc-400 sm:mt-5 sm:text-lg">
            The open-source prompt optimizer that teaches you why
          </p>

          <div className="mx-auto mt-12 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 md:mt-16">
            {steps.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`animate-fade-in flex min-w-0 flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-6 sm:px-6 sm:py-7 ${i === 0 ? 'animate-fade-in-delay-2' : i === 1 ? 'animate-fade-in-delay-3' : 'animate-fade-in-delay-4'}`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-[#4552FF]">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <span className="break-words text-center text-sm font-medium leading-snug text-[#ECECEC] sm:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="animate-fade-in animate-fade-in-delay-4 mx-auto mt-10 w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-5 sm:mt-12 sm:px-6">
            <p className="break-words text-center text-base leading-relaxed text-zinc-400">
              Free. Open-source. Your API key never leaves your browser.
            </p>
          </div>

          <Link
            href="/signup"
            className="animate-fade-in animate-fade-in-delay-5 mt-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[#4552FF] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:opacity-90 active:scale-[0.98] sm:mt-12"
          >
            Try it now
          </Link>
        </section>
      </div>

      <footer className="border-t border-zinc-800 bg-[#050505] px-6 py-10">
        <div className="mx-auto max-w-7xl text-center text-sm text-zinc-400">
          <p>© 2026 PromptPerfect. Open Source under MIT License.</p>
          <p className="mt-2 text-zinc-500">Built by Beagle Builder Program</p>
        </div>
      </footer>
    </main>
  );
}
