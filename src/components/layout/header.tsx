"use client";

import { useQuickLog } from "@/providers/quick-log-provider";

export function Header() {
  const { openQuickLog } = useQuickLog();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-warm-white border-b border-cream-dark">
      <div />
      <button
        onClick={() => openQuickLog()}
        className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors active:scale-[0.98]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Log a mention
      </button>
    </header>
  );
}
