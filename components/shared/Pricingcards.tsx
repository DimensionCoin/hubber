"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, HelpCircle, X, XCircle } from "lucide-react";
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
import { getUser } from "@/actions/user.action";
import { useUser } from "@clerk/nextjs";

// 🔹 Helper function for class merging
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// 🔹 Define `PricingTier` interface to avoid unused warning
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

export default function PricingTiers({ currentTier }: { currentTier: string }) {
  const { user, isLoaded } = useUser();
  const [activeCard, setActiveCard] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subscriptionTier: "free",
  });

  // 🔹 Stable fetch function
  const fetchUserData = useCallback(
    async (userId: string) => {
      try {
        const data = await getUser(userId);
        if (data) {
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || user?.primaryEmailAddress || "",
            subscriptionTier: data.subscriptionTier || "free",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [user]
  );

  // 🔹 Fetch user data when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData(user.id);
    }
  }, [isLoaded, user, fetchUserData]);

  // 🔹 Subscription Plans
  const tiers: PricingTier[] = [
    {
      id: 0,
      name: "free",
      description: "Perfect for getting started",
      price: "$0",
      features: [
        { text: "1 Company", included: true },
        { text: "1 Employee per company", included: true },
        { text: "Basic dashboard", included: true },
        {
          text: "Email support",
          included: false,
          tooltip: "Available on paid plans",
        },
      ],
    },
    {
      id: 1,
      name: "business",
      description: "For growing businesses",
      price: "$150",
      features: [
        { text: "5 Companies", included: true },
        { text: "5 Employees per company", included: true },
        {
          text: "Advanced dashboard",
          included: true,
          tooltip: "More insights & analytics",
        },
        {
          text: "Priority email support",
          included: true,
          tooltip: "Faster response times",
        },
      ],
    },
    {
      id: 2,
      name: "enterprise",
      description: "For large enterprises",
      price: "$250",
      features: [
        { text: "Unlimited Companies", included: true },
        { text: "Unlimited Employees", included: true },
        {
          text: "Enterprise dashboard",
          included: true,
          tooltip: "Full customization & control",
        },
        {
          text: "24/7 phone & email support",
          included: true,
          tooltip: "Dedicated support team",
        },
      ],
    },
  ];

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-500/20 mt-2 hover:text-black hover:bg-teal-400 text-white py-3 px-4 rounded-md transition"
      >
        Subscription Tier:
        <span className="font-semibold text-teal-300 ml-2">
          {userData.subscriptionTier.toUpperCase()}
        </span>
      </Button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 overflow-y-auto flex items-center justify-center p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-zinc-950 text-zinc-100 w-full max-w-4xl rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
              onClick={() => setIsOpen(false)}
            >
              <XCircle className="h-6 w-6" />
            </button>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
                  Choose Your Plan
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg">
                  Unlock the full potential of your business with the right
                  plan.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {tiers.map((tier) => (
                  <Card
                    key={tier.id}
                    className={cn(
                      "flex flex-col transition-all duration-300 cursor-pointer bg-zinc-900/50 backdrop-blur-lg border border-zinc-800/50 hover:shadow-lg hover:border-primary/50 text-zinc-400",
                      activeCard === tier.id &&
                        "border-2 border-primary shadow-xl",
                      activeCard === tier.id
                        ? "lg:scale-105"
                        : "lg:scale-95 lg:opacity-80"
                    )}
                    onMouseEnter={() => setActiveCard(tier.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl capitalize text-white">
                        {tier.name}
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                      <div className="flex items-baseline mt-2">
                        <span className="text-3xl font-bold text-white">
                          {tier.price}
                        </span>
                        <span className="ml-1 text-sm text-zinc-400">
                          /Yearly
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <ul className="space-y-3 text-sm">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-teal-400 shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-zinc-500 shrink-0" />
                            )}
                            <span className="flex items-center gap-1">
                              {feature.text}
                              {feature.tooltip && (
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      {currentTier !== tier.name && (
                        <Button
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                          asChild
                        >
                          <Link href="/sign-up">Buy Now</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
