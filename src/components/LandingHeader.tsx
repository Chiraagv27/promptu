'use client';

import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-[#050505]">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-[#ECECEC]">
          PromptPerfect by Beagle
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="cursor-pointer rounded-lg border border-[#4552FF] px-4 py-2 text-sm font-medium text-[#4552FF] transition hover:bg-[#4552FF]/10"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="cursor-pointer rounded-lg bg-[#4552FF] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
