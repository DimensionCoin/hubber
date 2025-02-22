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
    console.error("Stripe Webhook Error:", error);
    return new Response("Error in webhook verification", { status: 400 });
  }

  const data = event.data;
  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const session: Stripe.Checkout.Session =
      data.object as Stripe.Checkout.Session;

    // 🔹 Expand all necessary fields
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price", "metadata", "customer"],
    });

    const customerId = fullSession.customer as string;
    const metadata = fullSession.metadata;
    const priceId = fullSession?.line_items?.data?.[0]?.price?.id;

    // 🔥 Debugging: Log to confirm data is received
    console.log("Stripe Checkout Session:", fullSession);

    if (!metadata || !metadata.userId) {
      return new NextResponse("Missing metadata userId", { status: 400 });
    }

    if (priceId !== process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID) {
      return new NextResponse("Price ID does not match", { status: 400 });
    }

    // 🔹 Update user subscription tier to "basic"
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: metadata.userId },
      {
        subscriptionTier: "basic",
        customerId: customerId,
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 400 });
    }

    console.log("User upgraded to Basic:", updatedUser);
  } else if (eventType === "customer.subscription.deleted") {
    const subscription: Stripe.Subscription =
      data.object as Stripe.Subscription;

    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price?.id;

    if (priceId !== process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID) {
      return new NextResponse("Price ID does not match", { status: 400 });
    }

    // 🔹 Downgrade user to "free" plan
    const updatedUser = await User.findOneAndUpdate(
      { customerId },
      {
        subscriptionTier: "free",
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("No user found for customerId:", customerId);
    } else {
      console.log("User downgraded to Free plan:", updatedUser);
    }
  }

  revalidatePath("/", "layout");
  return new NextResponse("Webhook received", { status: 200 });
}
