"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/constants";

type BillingInterval = "monthly" | "annual";

const tiers = [
  {
    key: "free" as const,
    name: "Free",
    description: "Try your first palm reading at no cost.",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { text: "1 palm reading", included: true },
      { text: "1 profile (self only)", included: true },
      { text: "Personality, Life Path, Career", included: true },
      { text: "Relationships & Health", included: false },
      { text: "Lucky Numbers", included: false },
      { text: "Daily horoscope", included: false },
      { text: "Compatibility readings", included: false },
      { text: "PDF export", included: false },
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    key: "pro" as const,
    name: PLANS.pro.name,
    description: "Full readings for you and your loved ones.",
    monthlyPrice: PLANS.pro.monthlyPrice,
    annualPrice: PLANS.pro.annualPrice,
    features: [
      { text: "10 readings / month", included: true },
      { text: "Up to 3 profiles", included: true },
      { text: "All reading sections", included: true },
      { text: "Relationships & Health", included: true },
      { text: "Lucky Numbers", included: true },
      { text: "Daily & monthly horoscope", included: true },
      { text: "Compatibility readings", included: true },
      { text: "PDF export", included: true },
    ],
    cta: "Upgrade to Pro",
    href: "/sign-up",
    highlighted: true,
  },
  {
    key: "ultimate" as const,
    name: PLANS.ultimate.name,
    description: "Unlimited readings with premium features.",
    monthlyPrice: PLANS.ultimate.monthlyPrice,
    annualPrice: PLANS.ultimate.annualPrice,
    features: [
      { text: "Unlimited readings", included: true },
      { text: "Unlimited profiles", included: true },
      { text: "All reading sections", included: true },
      { text: "Detailed line overlay", included: true },
      { text: "Natal chart", included: true },
      { text: "Daily & monthly horoscope", included: true },
      { text: "Compatibility readings", included: true },
      { text: "PDF export", included: true },
    ],
    cta: "Upgrade to Ultimate",
    href: "/sign-up",
    highlighted: false,
  },
];

export default function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with a free reading. Upgrade anytime for full access.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setInterval("monthly")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              interval === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              interval === "annual"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </button>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const price =
              interval === "monthly" ? tier.monthlyPrice : tier.annualPrice;
            const period = interval === "monthly" ? "/mo" : "/yr";

            return (
              <Card
                key={tier.key}
                className={cn(
                  "relative flex flex-col",
                  tier.highlighted &&
                    "border-primary shadow-lg shadow-primary/10"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    {tier.name}
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground">{period}</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.text}
                        className="flex items-start gap-2 text-sm"
                      >
                        {feature.included ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                        )}
                        <span
                          className={cn(
                            !feature.included && "text-muted-foreground/60"
                          )}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={tier.href} className="w-full">
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
