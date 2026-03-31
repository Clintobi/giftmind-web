"use client";

import { useState, useEffect } from "react";
import type { AISuggestion } from "@/types";

export function SuggestionsPanel({
  personId,
  personName,
}: {
  personId: string;
  personName: string;
}) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  async function fetchSuggestions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personId }),
      });
      if (!res.ok) throw new Error("Failed to generate suggestions");
      const data = await res.json();
      setSuggestions(data.suggestions);
      setExpanded(true);
    } catch {
      setError("Could not generate suggestions. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-3">
      <button
        onClick={() => (expanded ? setExpanded(false) : suggestions.length ? setExpanded(true) : fetchSuggestions())}
        className="flex items-center gap-2 text-sm font-semibold text-warm-gray hover:text-coral transition-colors"
      >
        <span className="text-lg">✨</span>
        AI Gift Ideas for {personName}
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center gap-3 p-6 bg-warm-white rounded-xl border border-cream-dark">
              <div className="animate-spin w-5 h-5 border-2 border-coral border-t-transparent rounded-full" />
              <p className="text-sm text-warm-gray">Thinking about the perfect gifts...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 rounded-xl text-sm text-red-700">{error}</div>
          )}

          {suggestions.map((sug, i) => (
            <div key={i} className="p-4 bg-warm-white rounded-xl border border-cream-dark space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-soft-black">{sug.title}</h3>
                  <p className="text-xs text-warm-gray mt-0.5">{sug.description}</p>
                </div>
                <span className="shrink-0 px-2 py-0.5 bg-cream rounded-full text-xs font-medium text-warm-gray">
                  {sug.price_range}
                </span>
              </div>
              <p className="text-xs text-warm-gray-light italic">&ldquo;{sug.rationale}&rdquo;</p>
              <div className="flex gap-2 pt-1">
                {sug.affiliate_url_amazon && (
                  <a
                    href={sug.affiliate_url_amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9900]/10 text-[#FF9900] rounded-lg text-xs font-medium hover:bg-[#FF9900]/20 transition-colors"
                    onClick={() => trackClick(sug.title, "amazon")}
                  >
                    Shop on Amazon
                  </a>
                )}
                {sug.affiliate_url_bookshop && (
                  <a
                    href={sug.affiliate_url_bookshop}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                    onClick={() => trackClick(sug.title, "bookshop")}
                  >
                    Shop on Bookshop.org
                  </a>
                )}
              </div>
            </div>
          ))}

          {suggestions.length > 0 && (
            <p className="text-[10px] text-warm-gray-light text-center">
              As an Amazon Associate, GiftMind earns from qualifying purchases.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function trackClick(title: string, provider: "amazon" | "bookshop") {
  fetch("/api/affiliate/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ suggestion_text: title, provider }),
  }).catch(() => {});
}
