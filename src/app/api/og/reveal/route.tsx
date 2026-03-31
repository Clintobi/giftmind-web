import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  const cardId = request.nextUrl.searchParams.get("id");

  let days = 0;
  if (cardId) {
    try {
      const doc = await adminDb.collection("gift_cards").doc(cardId).get();
      if (doc.exists) {
        days = doc.data()!.days_remembered || 0;
      }
    } catch {
      // Use default
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #E8856C 0%, #D4705A 100%)",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>🎁</div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Someone remembered
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            marginTop: 16,
          }}
        >
          {days > 0 ? `A gift ${days} days in the making` : "A gift remembered with love"}
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.7,
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          GiftMind
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
