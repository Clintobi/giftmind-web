import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  try {
    const { priceId, email, uid } = await request.json();

    if (!priceId || !email || !uid) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      metadata: { firebase_uid: uid },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/dashboard?upgraded=true`,
      cancel_url: `${request.nextUrl.origin}/upgrade`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
