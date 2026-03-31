"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-warm-white rounded-2xl shadow-sm border border-cream-dark p-8 text-center">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="text-lg font-semibold text-soft-black mb-2">Check your email</h2>
        <p className="text-sm text-warm-gray mb-6">
          We sent a password reset link to <strong>{email}</strong>
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral-dark transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-warm-white rounded-2xl shadow-sm border border-cream-dark p-8">
      <h2 className="text-lg font-semibold text-soft-black mb-2">Reset your password</h2>
      <p className="text-sm text-warm-gray mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-warm-gray mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral text-sm"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-warm-gray">
        <Link href="/login" className="text-coral hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
