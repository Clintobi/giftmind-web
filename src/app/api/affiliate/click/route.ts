import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const { suggestion_text, provider } = await request.json();

    await adminDb.collection("affiliate_clicks").add({
      suggestion_text: suggestion_text || "",
      provider: provider || "unknown",
      clicked_at: FieldValue.serverTimestamp(),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true }); // Don't fail on tracking errors
  }
}
