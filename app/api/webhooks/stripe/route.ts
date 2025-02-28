import { stripe } from "@/lib/stripe";
import User from "@/modals/user.modal";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { connect } from "@/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  await connect();
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  const eventType = event.type;
  console.log(`🔔 Stripe Webhook Received: ${eventType}`);

  // ✅ Ensure the event contains the correct object type
  if (eventType === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.id) {
      console.error("❌ No session ID found in event");
      return new NextResponse("Invalid session data", { status: 400 });
    }

    const retrievedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      }
    );

    const customerId = retrievedSession.customer as string;
    const priceId = retrievedSession.line_items?.data[0]?.price?.id;
    const userId = retrievedSession.metadata?.userId; // Ensure metadata exists

    if (!userId) {
      console.error("⚠️ No userId found in metadata");
      return new NextResponse("Missing userId metadata", { status: 400 });
    }

    // 🔹 Map Stripe price ID to our subscription tiers
    let newSubscriptionTier = "free"; // Default
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID) {
      newSubscriptionTier = "basic";
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
      newSubscriptionTier = "premium";
    } else {
      console.error("❌ Unknown price ID:", priceId);
      return new NextResponse("Invalid price ID", { status: 400 });
    }

    // 🔹 Update user subscription in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        subscriptionTier: newSubscriptionTier,
        customerId: customerId,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ User not found:", userId);
      return new NextResponse("User not found", { status: 400 });
    }

    console.log(`✅ User ${userId} upgraded to ${newSubscriptionTier}`);
  }

  // 🔹 Handle subscription cancellations
  else if (eventType === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const updatedUser = await User.findOneAndUpdate(
      { customerId },
      {
        subscriptionTier: "free", // Reset user to free tier
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ No user found for customer ID:", customerId);
    } else {
      console.log(`✅ User ${updatedUser.clerkId} downgraded to Free tier.`);
    }
  }

  revalidatePath("/", "layout");
  return new NextResponse("Webhook received", { status: 200 });
}
