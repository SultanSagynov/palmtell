import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hand, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Readings",
};

export default function ReadingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Readings</h1>
          <p className="mt-1 text-muted-foreground">
            Your palm reading history and timeline.
          </p>
        </div>
        <Link href="/dashboard/readings/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Reading
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <Card className="border-border/40">
        <CardContent className="flex flex-col items-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Hand className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No Readings Yet</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            Upload a photo of your palm to get your first AI-powered reading.
            Your palm lines evolve over time — each reading captures a unique
            moment in your journey.
          </p>
          <Link href="/dashboard/readings/new" className="mt-6">
            <Button className="gap-2">
              <Hand className="h-4 w-4" />
              Start Your First Reading
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
