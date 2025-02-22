"use client";

import { useEffect, useState } from "react";
import {
  Check,
  HelpCircle,
  LineChart,
  Building2,
  Users,
  Bot,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getUser } from "@/actions/user.action"; // ✅ Fetch user info from MongoDB
import { useUser } from "@clerk/nextjs"; // ✅ Get Clerk user info

// Helper function for className merging
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

interface PricingTier {
  id: number;
  name: string;
  description: string;
  price: string;
  features: {
    text: string;
    included: boolean;
    tooltip?: string;
  }[];
}

export default function PricingTiers() {
  const { user, isLoaded } = useUser(); // ✅ Get Clerk user info
  const [activeCard, setActiveCard] = useState(1);
  const [userTier, setUserTier] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserSubscription(user.id);
    }
  }, [isLoaded, user]);

  // ✅ Fetch user's subscription tier from MongoDB
  async function fetchUserSubscription(userId: string) {
    try {
      const userData = await getUser(userId);
      if (userData?.subscriptionTier) {
        setUserTier(userData.subscriptionTier.toLowerCase()); // ✅ Ensure lowercase for consistency
        console.log(userData.subscriptionTier);
      }
    } catch (error) {
      console.error("Failed to fetch user subscription:", error);
    }
  }

  // ✅ Subscription plans
  const tiers: PricingTier[] = [
    {
      id: 0,
      name: "free",
      description: "Perfect for getting started with basic features",
      price: "$0",
      features: [
        { text: "1 Company", included: true },
        { text: "1 Employee per company", included: true },
        { text: "Basic dashboard", included: true },
        { text: "Email support", included: false },
        { text: "Data Analytics", included: false },
        { text: "AI Assistant", included: false },
        { text: "Priority Support", included: false },
      ],
    },
    {
      id: 1,
      name: "business",
      description: "Ideal for growing businesses with multiple companies",
      price: "$150",
      features: [
        { text: "5 Companies", included: true },
        { text: "5 Employees per company", included: true },
        { text: "Advanced dashboard", included: true },
        { text: "Priority email support", included: true },
        { text: "Basic Data Analytics", included: false },
        { text: "AI Assistant", included: false },
        { text: "24/7 Priority Support", included: false },
      ],
    },
    {
      id: 2,
      name: "enterprise",
      description: "For large enterprises requiring unlimited access",
      price: "$250",
      features: [
        { text: "Unlimited Companies", included: true },
        { text: "Unlimited Employees", included: true },
        { text: "Enterprise dashboard", included: true },
        { text: "24/7 phone & email support", included: true },
        { text: "Advanced Data Analytics", included: true },
        { text: "AI Assistant & Chatbot", included: true },
        { text: "Dedicated Support Team", included: true },
      ],
    },
  ];

  // ✅ Function to determine button text based on user's current tier
  function getButtonText(tierName: string) {
    if (tierName === userTier) {
      return "Current Plan";
    }
    if (userTier === "free") {
      return "Buy Now";
    }
    if (userTier === "business" && tierName === "enterprise") {
      return "Upgrade";
    }
    return "Buy Now";
  }

  return (
    <div className="text-zinc-100  flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center space-y-4 ">
        <h2 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
          Choose Your Plan
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto">
          Unlock the full potential of your business with the right plan.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6  z-10">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              "flex flex-col transition-all duration-300 cursor-pointer bg-zinc-900/50 backdrop-blur-lg border border-zinc-800/50 hover:shadow-lg hover:border-primary/50 text-zinc-400 mt-6",
              activeCard === tier.id &&
                "border-2 border-primary scale-105 shadow-xl",
              activeCard !== tier.id && "opacity-80 scale-95"
            )}
            onMouseEnter={() => setActiveCard(tier.id)}
          >
            <CardHeader className="flex-1">
              <CardTitle className="text-xl capitalize">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="flex items-center text-4xl font-bold">
                {tier.price}
                <span className="ml-1 text-sm font-normal text-zinc-400">
                  /Yearly
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    {feature.included ? (
                      <Check className="size-5 text-teal-400" />
                    ) : (
                      <X className="size-5 text-zinc-500" />
                    )}
                    <span className="flex items-center gap-1">
                      {feature.text}
                      {feature.tooltip && (
                        <HelpCircle className="size-4 text-zinc-500" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Link href="/sign-up" passHref>
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    activeCard === tier.id
                      ? "bg-teal-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  )}
                >
                  {getButtonText(tier.name)}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
