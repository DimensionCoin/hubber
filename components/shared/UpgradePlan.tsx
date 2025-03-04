"use client";

import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/providers/UserProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { subscribe } from "@/actions/stripe.actions";

interface UpgradePlanProps {
  title: string; // ✅ Dynamic title prop
}

const UpgradePlan: React.FC<UpgradePlanProps> = ({ title }) => {
  const { tier } = useUserContext();
  const { user, isSignedIn } = useUser();
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
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
      {/* Dynamic Header */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
          {title}
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg">
          Upgrade your plan to access more features and grow your business.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {tiers.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col bg-zinc-900/50 border ${
              plan.name === tier ? "border-primary" : "border-zinc-800/50"
            } hover:shadow-lg hover:border-primary/50 text-zinc-400 p-6 rounded-lg`}
          >
            <CardHeader>
              <CardTitle className="text-xl capitalize text-white">
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-zinc-400">/Yearly</span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {tier !== plan.name && plan.name !== "free" && (
                <Button
                  onClick={() =>
                    handleSubscribe(plan.name === "basic" ? "basic" : "premium")
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
  );
};

export default UpgradePlan;
