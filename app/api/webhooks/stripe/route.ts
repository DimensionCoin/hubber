import { stripe } from "@/lib/stripe";
import User from "@/modals/user.modal";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { connect } from "@/db";

export const dynamic = "force-dynamic"; // ✅ Ensures API route is recognized

export async function POST(request: NextRequest) {
  try {
    await connect();
    const reqHeaders = await headers(); // ✅ Await headers
    const body = await request.text();
    const signature = reqHeaders.get("Stripe-Signature"); // ✅ Now accessible

    if (!signature) {
      console.error("❌ Missing Stripe-Signature header");
      return new NextResponse("Missing Stripe-Signature", { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error) {
      console.error("❌ Stripe Webhook Signature Error:", error);
      return new Response("Error in webhook verification", { status: 400 });
    }

    console.log(
      `✅ Received Event: ${event.type}`,
      JSON.stringify(event, null, 2)
    );

    const { type, data } = event;
    const session = data.object as Stripe.Checkout.Session;

    if (type === "checkout.session.completed") {
      console.log("🔥 Processing checkout.session.completed");

      // 🔹 Expand necessary fields
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price", "customer"],
      });

      console.log(
        "✅ Full Session Data:",
        JSON.stringify(fullSession, null, 2)
      );

      // 🔹 Ensure customerObject is valid before accessing properties
      let customerId: string | null = null;
      if (typeof fullSession.customer === "string") {
        customerId = fullSession.customer; // ✅ Already a string
      } else if (fullSession.customer && "id" in fullSession.customer) {
        customerId = fullSession.customer.id; // ✅ Extracted from object
      }

      if (!customerId) {
        console.error("❌ Missing or null customer ID:", fullSession.customer);
        return new NextResponse("Missing customer ID", { status: 400 });
      }

      const metadata = session.metadata;
      const priceId = fullSession.line_items?.data?.[0]?.price?.id;

      console.log("🔹 Extracted Customer ID:", customerId);
      console.log("🔹 Extracted Metadata:", metadata);
      console.log("🔹 Extracted Price ID:", priceId);

      if (!metadata || !metadata.userId) {
        console.error("❌ Missing metadata.userId:", metadata);
        return new NextResponse("Missing metadata userId", { status: 400 });
      }

      if (!priceId) {
        console.error("❌ Missing Price ID");
        return new NextResponse("Missing Price ID", { status: 400 });
      }

      // 🔹 Determine subscription tier
      let newSubscriptionTier = "free"; // Default
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID) {
        newSubscriptionTier = "basic";
      } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
        newSubscriptionTier = "premium";
      } else {
        console.error("❌ Unknown Price ID:", priceId);
        return new NextResponse("Unknown Price ID", { status: 400 });
      }

      console.log(
        `🚀 Updating user ${metadata.userId} to ${newSubscriptionTier}`
      );

      // 🔹 Update user in MongoDB
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: metadata.userId },
        {
          subscriptionTier: newSubscriptionTier,
          customerId: customerId, // ✅ Now always a string
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error("❌ User not found in DB for clerkId:", metadata.userId);
        return new NextResponse("User not found", { status: 400 });
      }

      console.log(`✅ User upgraded to ${newSubscriptionTier}:`, updatedUser);
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook Processing Error:", error);
    return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
  }
}
