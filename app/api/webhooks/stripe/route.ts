import { stripe } from "@/lib/stripe";
import User from "@/modals/user.modal";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/db";

// Force dynamic rendering for API routes
export const dynamic = "force-dynamic";

// Buffer utility to get raw body with proper typing
async function buffer(req: Request): Promise<Buffer> {
  if (!req.body) {
    throw new Error("Request body is null");
  }

  const chunks: Uint8Array[] = [];
  const reader = req.body.getReader(); // Get ReadableStream reader
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) {
      chunks.push(value); // value is Uint8Array
    }
    done = streamDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  try {
    await connect();

    // Get headers
    const reqHeaders = await headers();
    const signature = reqHeaders.get("Stripe-Signature");

    if (!signature) {
      console.error("❌ Missing Stripe-Signature header");
      return new NextResponse("Missing Stripe-Signature", { status: 400 });
    }

    // Get raw body
    const rawBody = await buffer(request);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Stripe Webhook Signature Error:", errorMessage);
      return new NextResponse(`Webhook verification failed: ${errorMessage}`, {
        status: 400,
      });
    }

    console.log(`✅ Received Event: ${event.type}`);

    // Handle events
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
          return new NextResponse("Missing customer ID", { status: 400 });
        }

        const metadata = session.metadata;
        const priceId = fullSession.line_items?.data?.[0]?.price?.id;

        if (!metadata || !metadata.userId) {
          console.error("❌ Missing metadata.userId:", metadata);
          return new NextResponse("Missing metadata userId", { status: 400 });
        }

        if (!priceId) {
          console.error("❌ Missing Price ID");
          return new NextResponse("Missing Price ID", { status: 400 });
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
          return new NextResponse("Unknown Price ID", { status: 400 });
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
          return new NextResponse("User not found", { status: 400 });
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

    return new NextResponse("Webhook received", { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Webhook Processing Error:", errorMessage);
    return new NextResponse(`Internal Server Error: ${errorMessage}`, {
      status: 500,
    });
  }
}
