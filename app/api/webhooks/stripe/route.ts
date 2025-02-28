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
  const signature = (await headers()).get("Stripe-Signature") as string; // ✅ Fixed

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

    // 🔹 Retrieve user from MongoDB by customerId
    let user = await User.findOne({ customerId });

    // 🔹 If no user found, retrieve by email from Stripe
    if (!user) {
      const customer = await stripe.customers.retrieve(customerId);
      const email = (customer as Stripe.Customer).email;

      if (!email) {
        console.error("❌ Could not retrieve email from Stripe customer.");
        return new NextResponse("Invalid customer data", { status: 400 });
      }

      user = await User.findOne({ email });

      if (user) {
        // 🔹 Store the missing `customerId` in the database
        user.customerId = customerId;
        await user.save();
      }
    }

    if (!user) {
      console.error(`❌ No user found with customerId: ${customerId}`);
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

    // 🔹 Update user's subscription in MongoDB
    await User.findOneAndUpdate(
      { customerId },
      { subscriptionTier: newSubscriptionTier },
      { new: true }
    );

    console.log(`✅ User ${user.clerkId} upgraded to ${newSubscriptionTier}`);
  }

  // 🔹 Handle subscription cancellations
  else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

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
