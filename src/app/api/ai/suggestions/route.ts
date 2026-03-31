import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { generateGiftSuggestions } from "@/lib/claude/suggestions";

export async function POST(request: NextRequest) {
  try {
    const { personId } = await request.json();

    if (!personId) {
      return Response.json({ error: "personId required" }, { status: 400 });
    }

    // Get person data
    const personDoc = await adminDb.collection("persons").doc(personId).get();
    if (!personDoc.exists) {
      return Response.json({ error: "Person not found" }, { status: 404 });
    }
    const person = personDoc.data()!;

    // Check user subscription
    const userDoc = await adminDb.collection("users").doc(person.user_id).get();
    if (!userDoc.exists || userDoc.data()!.subscription_status !== "pro") {
      return Response.json({ error: "Pro subscription required" }, { status: 403 });
    }

    // Get notes for this person
    const notesSnap = await adminDb
      .collection("notes")
      .where("person_id", "==", personId)
      .where("status", "==", "active")
      .orderBy("created_at", "desc")
      .limit(20)
      .get();

    if (notesSnap.size < 2) {
      return Response.json({ error: "Need at least 2 notes" }, { status: 400 });
    }

    const notes = notesSnap.docs.map((d) => {
      const data = d.data();
      return {
        text: data.text,
        category: data.category,
        created_at: data.created_at?.toDate?.()?.toLocaleDateString() || "recently",
      };
    });

    // Generate suggestions
    const suggestions = await generateGiftSuggestions(
      person.name,
      person.relationship,
      notes
    );

    // Add affiliate URLs
    const amazonTag = process.env.AMAZON_ASSOCIATE_TAG || "giftmind-20";
    const bookshopId = process.env.BOOKSHOP_AFFILIATE_ID || "";

    const enriched = suggestions.map((sug) => ({
      ...sug,
      affiliate_url_amazon: `https://www.amazon.com/s?k=${encodeURIComponent(sug.search_query)}&tag=${amazonTag}`,
      affiliate_url_bookshop:
        sug.category === "book"
          ? `https://bookshop.org/search?keywords=${encodeURIComponent(sug.search_query)}${bookshopId ? `&affiliate=${bookshopId}` : ""}`
          : undefined,
    }));

    return Response.json({ suggestions: enriched });
  } catch (error) {
    console.error("AI suggestions error:", error);
    return Response.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
