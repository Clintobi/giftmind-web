"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { SUBSCRIPTION_MONTHLY_PRICE, SUBSCRIPTION_ANNUAL_PRICE } from "@/lib/utils/constants";

export default function UpgradePage() {
  const { user, firebaseUser } = useAuth();
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);

  if (user?.subscription_status === "pro") {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <span className="text-5xl">✨</span>
        <h1 className="mt-4 text-2xl font-semibold text-soft-black">You&apos;re on Pro!</h1>
        <p className="mt-2 text-sm text-warm-gray">
          Unlimited people, AI suggestions, and full gift history.
        </p>
      </div>
    );
  }

  async function handleCheckout(plan: "monthly" | "annual") {
    if (!firebaseUser) return;
    setLoading(plan);
    try {
      const priceId =
        plan === "monthly"
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_monthly"
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || "price_annual";

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-10">
        <span className="text-4xl">🎁</span>
        <h1 className="mt-4 text-2xl font-semibold text-soft-black">Upgrade to GiftMind Pro</h1>
        <p className="mt-2 text-sm text-warm-gray max-w-md mx-auto">
          Never give a generic gift again. Unlimited people, AI-powered suggestions, and full gift history.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Annual — featured */}
        <div className="relative p-6 bg-warm-white rounded-2xl border-2 border-coral shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-coral text-white rounded-full text-xs font-medium">
            Save 50%
          </div>
          <h2 className="text-lg font-semibold text-soft-black">Annual</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-soft-black">${SUBSCRIPTION_ANNUAL_PRICE}</span>
            <span className="text-sm text-warm-gray">/year</span>
          </div>
          <p className="text-xs text-warm-gray-light mt-1">
            ~$2.50/month · Billed annually
          </p>
          <button
            onClick={() => handleCheckout("annual")}
            disabled={loading !== null}
            className="w-full mt-6 py-3 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
          >
            {loading === "annual" ? "Redirecting..." : "Get Annual Plan"}
          </button>
        </div>

        {/* Monthly */}
        <div className="p-6 bg-warm-white rounded-2xl border border-cream-dark">
          <h2 className="text-lg font-semibold text-soft-black">Monthly</h2>
          <div className="mt-2">
            <span className="text-3xl font-bold text-soft-black">${SUBSCRIPTION_MONTHLY_PRICE}</span>
            <span className="text-sm text-warm-gray">/month</span>
          </div>
          <p className="text-xs text-warm-gray-light mt-1">
            Billed monthly · Cancel anytime
          </p>
          <button
            onClick={() => handleCheckout("monthly")}
            disabled={loading !== null}
            className="w-full mt-6 py-3 border border-coral text-coral rounded-lg font-medium text-sm hover:bg-coral/5 transition-colors disabled:opacity-50"
          >
            {loading === "monthly" ? "Redirecting..." : "Get Monthly Plan"}
          </button>
        </div>
      </div>

      {/* Feature comparison */}
      <div className="mt-10 bg-warm-white rounded-2xl border border-cream-dark p-6">
        <h3 className="text-sm font-semibold text-soft-black mb-4">What you get with Pro</h3>
        <div className="space-y-3">
          {[
            ["Unlimited people", "Track everyone you care about, not just 10"],
            ["AI gift suggestions", "Claude-powered ideas based on your notes"],
            ["All occasion types", "Beyond birthdays — anniversaries, holidays, custom dates"],
            ["Full gift history", "See every gift you've ever given"],
            ["Budget tracker", "Plan your gifting spend per person"],
            ["Priority support", "Direct support from the GiftMind team"],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-coral shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div>
                <p className="text-sm font-medium text-soft-black">{title}</p>
                <p className="text-xs text-warm-gray-light">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
