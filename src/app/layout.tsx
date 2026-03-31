import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { QuickLogProvider } from "@/providers/quick-log-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GiftMind — Never forget what the people you love mention",
    template: "%s | GiftMind",
  },
  description:
    "Log what people mention they love. Get reminded before their birthday. Give the perfect gift every time.",
  openGraph: {
    title: "GiftMind — Never forget what the people you love mention",
    description:
      "Log what people mention they love. Get reminded before their birthday. Give the perfect gift every time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-cream text-soft-black antialiased">
        <AuthProvider>
          <QuickLogProvider>{children}</QuickLogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
