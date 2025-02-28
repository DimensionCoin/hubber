"use client";

import { useState } from "react";
import { Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { subscribe } from "@/actions/stripe.actions";

// Define Props
interface PricingTiersProps {
  currentTier: string;
}

const PricingTiers: React.FC<PricingTiersProps> = ({ currentTier }) => {
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Subscription Plans
  const tiers = [
    {
      id: 0,
      name: "free",
      description: "Perfect for getting started",
      price: "$0",
      features: [
        "1 Company",
        "1 Employee per company",
        "Basic dashboard",
        "Email support (Paid Only)",
      ],
    },
    {
      id: 1,
      name: "basic",
      description: "For growing businesses",
      price: "$150",
      features: [
        "5 Companies",
        "5 Employees per company",
        "Advanced dashboard",
        "Priority email support",
      ],
    },
    {
      id: 2,
      name: "premium",
      description: "For large enterprises",
      price: "$250",
      features: [
        "Unlimited Companies",
        "Unlimited Employees",
        "Enterprise dashboard",
        "24/7 phone & email support",
      ],
    },
  ];

  const handleSubscribe = async (tier: "basic" | "premium") => {
    if (!isSignedIn) return alert("Please sign in to subscribe");

    const priceId =
      tier === "basic"
        ? process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;

    const url = await subscribe({
      userId: user?.id || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      priceId: priceId!,
    });

    if (url) {
      router.push(url);
    } else {
      alert("Failed to subscribe");
    }
  };

  return (
    <>
      {/* Button to Open Modal */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-500/20 mt-2 hover:text-black hover:bg-teal-400 text-white py-3 px-4 rounded-md transition"
      >
        Tier:
        <span className="font-semibold text-teal-300 ml-2">
          {currentTier.toUpperCase()}
        </span>
      </Button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
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
                    className="flex flex-col bg-zinc-900/50 border border-zinc-800/50 hover:shadow-lg hover:border-primary/50 text-zinc-400 p-6 rounded-lg"
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
                            <Check className="h-5 w-5 text-teal-400 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    {/* Subscription Button Logic */}
                    <CardFooter>
                      {currentTier !== tier.name && tier.name !== "free" && (
                        <Button
                          onClick={() =>
                            handleSubscribe(
                              tier.name === "basic" ? "basic" : "premium"
                            )
                          }
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          Subscribe
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
};

export default PricingTiers;
