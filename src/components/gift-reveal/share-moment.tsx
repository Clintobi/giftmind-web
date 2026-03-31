"use client";

import { useState } from "react";
import { updateGiftCardReaction } from "@/lib/firebase/firestore";

export function ShareMoment({
  cardId,
  personName,
  noteText,
  daysRemembered,
  onClose,
}: {
  cardId: string;
  personName: string;
  noteText: string;
  daysRemembered: number;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState("");
  const [reactionSaved, setReactionSaved] = useState(false);

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/gift/${cardId}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Someone remembered something special",
          text: `A gift ${daysRemembered} days in the making.`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      copyLink();
    }
  }

  async function saveReaction() {
    if (!reaction.trim()) return;
    await updateGiftCardReaction(cardId, reaction.trim());
    setReactionSaved(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-soft-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-warm-white rounded-2xl shadow-xl overflow-hidden">
        {/* Celebration header */}
        <div className="bg-gradient-to-br from-coral to-coral-dark p-8 text-center text-white">
          <span className="text-4xl">🎁</span>
          <h2 className="mt-3 text-xl font-semibold">You remembered!</h2>
          <p className="mt-1 text-sm text-white/80">
            Something {personName} mentioned <strong>{daysRemembered} days ago</strong>
          </p>
          <div className="mt-4 p-3 bg-white/10 rounded-xl">
            <p className="text-sm italic">&ldquo;{noteText}&rdquo;</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Share section */}
          <div>
            <p className="text-sm font-medium text-soft-black mb-2">Share the Gift Reveal Card</p>
            <div className="flex gap-2">
              <button
                onClick={shareNative}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share
              </button>
              <button
                onClick={copyLink}
                className="px-4 py-2.5 border border-cream-dark rounded-lg text-sm font-medium text-warm-gray hover:bg-cream transition-colors"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>

          {/* Testimonial capture */}
          {!reactionSaved ? (
            <div>
              <p className="text-sm font-medium text-soft-black mb-1.5">
                How did {personName} react?
              </p>
              <p className="text-xs text-warm-gray-light mb-2">
                Your answer helps us show others why GiftMind works.
              </p>
              <textarea
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-coral/30 text-sm resize-none"
                placeholder="e.g. She couldn't believe I remembered..."
              />
              <button
                onClick={saveReaction}
                disabled={!reaction.trim()}
                className="mt-2 px-4 py-1.5 bg-coral/10 text-coral rounded-lg text-xs font-medium hover:bg-coral/20 disabled:opacity-50"
              >
                Save reaction
              </button>
            </div>
          ) : (
            <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700 text-center">
              Thank you! That&apos;s the magic of remembering.
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-warm-gray-light hover:text-warm-gray"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
