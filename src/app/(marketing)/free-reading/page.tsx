import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hand, Camera, Upload } from "lucide-react";
import type { Metadata } from "next";
import { DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Free Palm Reading Online",
  description:
    "Get a free AI-powered palm reading. Upload a photo of your palm and discover your personality, career path, and life insights instantly.",
};

export default function FreeReadingPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            Your Free Palm Reading
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload a clear photo of your palm to get started. No account
            needed for the first reading.
          </p>
        </div>

        <Card className="mt-12 border-border/40 bg-card/50">
          <CardContent className="flex flex-col items-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Hand className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">
              Palm Upload Coming Soon
            </h2>
            <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
              The palm photo upload and AI analysis pipeline will be available
              in the next update. For now, create an account to be the first to
              try it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  <Camera className="h-5 w-5" />
                  Create Account
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2" disabled>
                <Upload className="h-5 w-5" />
                Upload Palm Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-12 space-y-6">
          <h3 className="text-lg font-semibold">Tips for a Good Palm Photo</h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              "Use good lighting — natural daylight works best",
              "Open your hand fully with fingers spread slightly",
              "Hold your palm flat facing the camera",
              "Make sure all major lines are visible",
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          {DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
