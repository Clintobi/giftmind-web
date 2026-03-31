"use client";

import { useAuth } from "@/providers/auth-provider";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { user, firebaseUser } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold text-soft-black">Settings</h1>

      {/* Account */}
      <section className="bg-warm-white rounded-xl border border-cream-dark p-6 space-y-4">
        <h2 className="text-sm font-semibold text-warm-gray">Account</h2>
        <div>
          <p className="text-xs text-warm-gray-light">Email</p>
          <p className="text-sm text-soft-black">{firebaseUser?.email}</p>
        </div>
        <div>
          <p className="text-xs text-warm-gray-light">Name</p>
          <p className="text-sm text-soft-black">{user?.display_name || "Not set"}</p>
        </div>
      </section>

      {/* Subscription */}
      <section className="bg-warm-white rounded-xl border border-cream-dark p-6 space-y-4">
        <h2 className="text-sm font-semibold text-warm-gray">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-soft-black">
              {user?.subscription_status === "pro" ? "GiftMind Pro" : "Free Plan"}
            </p>
            <p className="text-xs text-warm-gray-light">
              {user?.subscription_status === "pro"
                ? "Unlimited people, AI suggestions, full history"
                : `${user?.people_count || 0}/10 people used`}
            </p>
          </div>
          {user?.subscription_status !== "pro" && (
            <Link
              href="/upgrade"
              className="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
            >
              Upgrade
            </Link>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-warm-white rounded-xl border border-cream-dark p-6 space-y-4">
        <h2 className="text-sm font-semibold text-warm-gray">Notifications</h2>
        <p className="text-xs text-warm-gray-light">
          Browser notifications for birthday and occasion reminders. Make sure notifications are
          enabled in your browser settings.
        </p>
        <button
          onClick={async () => {
            if ("Notification" in window) {
              await Notification.requestPermission();
            }
          }}
          className="px-4 py-2 border border-cream-dark rounded-lg text-sm text-warm-gray hover:bg-cream transition-colors"
        >
          Enable notifications
        </button>
      </section>

      {/* Data */}
      <section className="bg-warm-white rounded-xl border border-cream-dark p-6 space-y-4">
        <h2 className="text-sm font-semibold text-warm-gray">Your data</h2>
        <p className="text-xs text-warm-gray-light">
          Your notes are private and encrypted. Only you can see them.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-cream-dark rounded-lg text-sm text-warm-gray hover:bg-cream transition-colors">
            Export as JSON
          </button>
          <button className="px-4 py-2 border border-cream-dark rounded-lg text-sm text-warm-gray hover:bg-cream transition-colors">
            Export as CSV
          </button>
        </div>
      </section>

      {/* Sign out */}
      <div className="pt-4">
        <button
          onClick={handleSignOut}
          className="text-sm text-warm-gray-light hover:text-red-500 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
