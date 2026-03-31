import { NextRequest } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing signature", { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.metadata?.firebase_uid;
      if (uid) {
        await adminDb
          .collection("users")
          .doc(uid)
          .update({
            subscription_status: "pro",
            subscription_provider: "stripe",
            stripe_customer_id: session.customer as string,
            updated_at: FieldValue.serverTimestamp(),
          });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const snap = await adminDb
        .collection("users")
        .where("stripe_customer_id", "==", customerId)
        .limit(1)
        .get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({
          subscription_status: "expired",
          updated_at: FieldValue.serverTimestamp(),
        });
      }
      break;
    }
  }

  return Response.json({ received: true });
}
