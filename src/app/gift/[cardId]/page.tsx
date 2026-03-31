import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import Link from "next/link";

interface Props {
  params: Promise<{ cardId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params;
  const doc = await adminDb.collection("gift_cards").doc(cardId).get();

  if (!doc.exists) {
    return { title: "Gift not found | GiftMind" };
  }

  const card = doc.data()!;
  const days = card.days_remembered || 0;

  return {
    title: "Someone remembered something special",
    description: `A gift ${days} days in the making. Sent with GiftMind.`,
    openGraph: {
      title: "Someone remembered something special",
      description: `A gift ${days} days in the making.`,
      type: "website",
      images: [
        {
          url: `/api/og/reveal?id=${cardId}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Someone remembered something special",
      description: `A gift ${days} days in the making.`,
    },
  };
}

export default async function GiftRevealPage({ params }: Props) {
  const { cardId } = await params;
  const doc = await adminDb.collection("gift_cards").doc(cardId).get();

  if (!doc.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="text-center">
          <span className="text-5xl">🎁</span>
          <h1 className="mt-4 text-xl font-semibold text-soft-black">Gift not found</h1>
          <p className="mt-2 text-sm text-warm-gray">This gift reveal link may have expired.</p>
          <Link href="/" className="inline-block mt-6 px-6 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors">
            Learn about GiftMind
          </Link>
        </div>
      </div>
    );
  }

  const card = doc.data()!;

  // Increment view count (fire-and-forget)
  doc.ref.update({ view_count: FieldValue.increment(1) }).catch(() => {});

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      {/* The Gift Reveal Card */}
      <div className="w-full max-w-md">
        <div className="bg-warm-white rounded-2xl shadow-lg overflow-hidden border border-cream-dark">
          {/* Card header */}
          <div className="bg-gradient-to-br from-coral to-coral-dark px-8 py-10 text-center text-white">
            <span className="text-5xl">🎁</span>
            <h1 className="mt-4 text-2xl font-semibold">Someone remembered</h1>
            <p className="mt-1 text-white/80 text-sm">
              {card.days_remembered} days in the making
            </p>
          </div>

          {/* Card body */}
          <div className="px-8 py-8 space-y-6">
            {/* The note */}
            <div className="p-5 bg-cream rounded-xl">
              <p className="text-warm-gray-light text-xs uppercase tracking-wider mb-2">
                {card.person_name} mentioned
              </p>
              <p className="text-soft-black text-base leading-relaxed">
                &ldquo;{card.note_text}&rdquo;
              </p>
              <p className="mt-3 text-xs text-warm-gray-light">
                Noted {card.days_remembered} days ago · {card.note_category}
              </p>
            </div>

            {/* Optional message */}
            {card.message && (
              <div className="text-center">
                <p className="text-sm text-warm-gray italic">&ldquo;{card.message}&rdquo;</p>
              </div>
            )}

            {/* Occasion badge */}
            {card.occasion_type && (
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-sky/10 text-sky-dark rounded-full text-xs font-medium">
                  {card.occasion_type}
                </span>
              </div>
            )}
          </div>

          {/* GiftMind footer */}
          <div className="px-8 py-6 border-t border-cream-dark bg-cream/50 text-center">
            <p className="text-xs text-warm-gray-light">Sent with</p>
            <p className="text-sm font-semibold text-coral mt-0.5">🎁 GiftMind</p>
          </div>
        </div>

        {/* CTA below card */}
        <div className="mt-8 text-center">
          <p className="text-sm text-warm-gray">
            GiftMind helps you remember what the people you love mention.
          </p>
          <Link
            href={`/signup?ref=gift-card&card=${cardId}`}
            className="inline-block mt-4 px-6 py-2.5 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral-dark transition-colors"
          >
            Start free — never forget again
          </Link>
        </div>
      </div>
    </div>
  );
}
