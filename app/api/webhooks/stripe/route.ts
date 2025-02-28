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

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET environment variable");
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }

  console.log(`🔔 Stripe Webhook Received: ${event.type}`);

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price?.id;

    if (!customerId || !priceId) {
      console.error("❌ Missing customerId or priceId in subscription event.");
      return new NextResponse("Invalid subscription data", { status: 400 });
    }

    // 🔹 Retrieve the Stripe customer to get the email
    const customer = await stripe.customers.retrieve(customerId);
    const email = (customer as Stripe.Customer).email;

    if (!email) {
      console.error("❌ Could not retrieve email from Stripe customer.");
      return new NextResponse("Invalid customer data", { status: 400 });
    }

    // 🔹 Find user in MongoDB by email (if customerId is missing)
    let user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      return new NextResponse("User not found", { status: 400 });
    }

    // 🔹 Map Stripe price ID to subscription tiers
    let newSubscriptionTier = "free";
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
      { email },
      {
        subscriptionTier: newSubscriptionTier,
        customerId: customerId, // ✅ Store customerId in MongoDB
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ No user found for email:", email);
      return new NextResponse("User not found", { status: 400 });
    }

    console.log(
      `✅ User ${updatedUser.clerkId} upgraded to ${newSubscriptionTier} with Stripe customer ID: ${customerId}`
    );
  }

  // 🔹 Handle subscription cancellations
  else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // 🔹 Find user by `customerId` and reset to free tier
    const updatedUser = await User.findOneAndUpdate(
      { customerId },
      { subscriptionTier: "free" }, // Reset to free tier
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ No user found for customer ID:", customerId);
    } else {
      console.log(`✅ User ${updatedUser.clerkId} downgraded to Free tier.`);
    }
  }

  revalidatePath("/", "layout");
  return new NextResponse("Webhook processed successfully", { status: 200 });
}
