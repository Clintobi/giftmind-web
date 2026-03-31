"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { QuickLogModal } from "@/components/log/quick-log-modal";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/login");
    }
  }, [loading, firebaseUser, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <span className="text-4xl">🎁</span>
          <p className="mt-2 text-sm text-warm-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) return null;

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="px-4 py-6 md:px-8 pb-24 md:pb-8">{children}</main>
      </div>
      <MobileNav />
      <QuickLogModal />
    </div>
  );
}
