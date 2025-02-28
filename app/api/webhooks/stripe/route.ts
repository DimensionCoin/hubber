import { stripe } from "@/lib/stripe";
import User from "@/modals/user.modal";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { connect } from "@/db";

export const runtime = "nodejs";

// ✅ Handle only POST requests
export async function POST(request: NextRequest) {
  try {
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

    // ✅ Handle Checkout Session Completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!customerId || !subscriptionId) {
        console.error(
          "❌ Missing customerId or subscriptionId in checkout session."
        );
        return new NextResponse("Invalid session data", { status: 400 });
      }

      console.log(
        `✅ Checkout completed for customer: ${customerId}, subscription: ${subscriptionId}`
      );

      // 🔹 Retrieve the subscription details to extract priceId
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data?.[0]?.price?.id;

      if (!priceId) {
        console.error("❌ Could not extract priceId from subscription.");
        return new NextResponse("Invalid subscription data", { status: 400 });
      }

      console.log(
        `📌 Subscription confirmed for customer ${customerId}. Price ID: ${priceId}`
      );

      // 🔹 Retrieve user from MongoDB by customerId
      let user = await User.findOne({ customerId });

      if (!user) {
        console.log(
          `🔍 No user found with customerId: ${customerId}. Looking up by email...`
        );

        // 🔹 If no user found, retrieve by email from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email;

        if (!email) {
          console.error("❌ Could not retrieve email from Stripe customer.");
          return new NextResponse("Invalid customer data", { status: 400 });
        }

        user = await User.findOne({ email });

        if (user) {
          console.log(`✅ Found user by email: ${email}, updating customerId.`);
          user.customerId = customerId;
          await user.save();
        }
      }

      if (!user) {
        console.error(`❌ No user found with customerId: ${customerId}`);
        return new NextResponse("User not found", { status: 400 });
      }

      // 🔹 Ensure correct tier mapping
      let newSubscriptionTier = "free";
      const basicPriceId = String(
        process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
      ).trim();
      const premiumPriceId = String(
        process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
      ).trim();

      if (priceId.trim() === basicPriceId) {
        newSubscriptionTier = "basic";
      } else if (priceId.trim() === premiumPriceId) {
        newSubscriptionTier = "premium";
      } else {
        console.error(
          `❌ Unknown price ID: ${priceId}. Expected: ${basicPriceId} or ${premiumPriceId}`
        );
        return new NextResponse("Invalid price ID", { status: 400 });
      }

      // 🔹 Update user's subscription in MongoDB
      const updatedUser = await User.findOneAndUpdate(
        { customerId },
        { subscriptionTier: newSubscriptionTier },
        { new: true }
      );

      if (!updatedUser) {
        console.error(
          `❌ Failed to update user subscription for ${customerId}`
        );
        return new NextResponse("Failed to update subscription", {
          status: 500,
        });
      }

      console.log(
        `✅ User ${updatedUser.clerkId} upgraded to ${newSubscriptionTier}`
      );
    }

    // ✅ Handle Subscription Cancellation
    else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      console.log(
        `📌 Subscription canceled for customer ${customerId}. Resetting tier to free.`
      );

      const updatedUser = await User.findOneAndUpdate(
        { customerId },
        { subscriptionTier: "free" },
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
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ Fix Webhook Failing (405 Method Not Allowed)
export function OPTIONS() {
  return new NextResponse("OK", { status: 200 });
}
