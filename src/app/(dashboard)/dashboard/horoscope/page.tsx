import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horoscope",
};

export default function HoroscopePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Horoscope</h1>
        <p className="mt-1 text-muted-foreground">
          Your daily and monthly horoscope based on your birth date.
        </p>
      </div>

      <Card className="border-border/40">
        <CardContent className="flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Star className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            Set Your Date of Birth
          </h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            Add your date of birth to your profile to unlock personalized daily
            and monthly horoscope readings.
          </p>
          <Link href="/dashboard/profiles" className="mt-6">
            <Button variant="outline" className="gap-2">
              Go to Profiles
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
