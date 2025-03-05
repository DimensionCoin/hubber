import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/db";
import User from "@/modals/user.modal";

// ✅ Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

// ✅ Stripe Webhook Secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ✅ Disable Next.js automatic request body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Function to Read Raw Request Body
async function readRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Request body is missing");

  let done = false;
  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) chunks.push(value);
    done = streamDone;
  }
  return Buffer.concat(chunks);
}

// ✅ Handle Stripe Webhook Events
export async function POST(req: NextRequest) {
  try {
    await connect();

    // ✅ Extract raw body
    const rawBody = await readRawBody(req);
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      console.error("❌ Missing Stripe signature header");
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
      console.error("❌ Stripe Webhook Signature Error:", err.message);
      return NextResponse.json(
        { error: `Webhook verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`✅ Received Event: ${event.type}`);

    // ✅ Handle Stripe Events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("🔥 Processing checkout.session.completed");

        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items.data.price", "customer"],
          }
        );

        let customerId: string | null = null;
        if (typeof fullSession.customer === "string") {
          customerId = fullSession.customer;
        } else if (fullSession.customer && "id" in fullSession.customer) {
          customerId = fullSession.customer.id;
        }

        if (!customerId) {
          console.error("❌ Missing customer ID:", fullSession.customer);
          return NextResponse.json(
            { error: "Missing customer ID" },
            { status: 400 }
          );
        }

        const metadata = session.metadata;
        const priceId = fullSession.line_items?.data?.[0]?.price?.id;

        if (!metadata || !metadata.userId) {
          console.error("❌ Missing metadata.userId:", metadata);
          return NextResponse.json(
            { error: "Missing metadata userId" },
            { status: 400 }
          );
        }

        if (!priceId) {
          console.error("❌ Missing Price ID");
          return NextResponse.json(
            { error: "Missing Price ID" },
            { status: 400 }
          );
        }

        let newSubscriptionTier = "free";
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID) {
          newSubscriptionTier = "basic";
        } else if (
          priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
        ) {
          newSubscriptionTier = "premium";
        } else {
          console.error("❌ Unknown Price ID:", priceId);
          return NextResponse.json(
            { error: "Unknown Price ID" },
            { status: 400 }
          );
        }

        const updatedUser = await User.findOneAndUpdate(
          { clerkId: metadata.userId },
          {
            subscriptionTier: newSubscriptionTier,
            customerId,
          },
          { new: true }
        );

        if (!updatedUser) {
          console.error("❌ User not found for clerkId:", metadata.userId);
          return NextResponse.json(
            { error: "User not found" },
            { status: 400 }
          );
        }

        console.log(`✅ User upgraded to ${newSubscriptionTier}`);
        break;
      }

      case "customer.subscription.created":
        console.log("✅ Subscription created:", event.data.object);
        break;
      case "invoice.payment_succeeded":
        console.log("✅ Payment succeeded:", event.data.object);
        break;
      case "customer.subscription.deleted":
        console.log("✅ Subscription deleted:", event.data.object);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Webhook Processing Error:", error.message);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
