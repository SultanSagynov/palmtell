import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hand, BookOpen, Star, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here&apos;s your palm reading overview.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Reading</CardTitle>
            <Hand className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Upload a palm photo to get your AI analysis.
            </p>
            <Link href="/dashboard/readings/new" className="mt-4 inline-block">
              <Button size="sm" className="gap-1">
                Start Reading
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Readings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">readings completed</p>
            <Link href="/dashboard/readings" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="gap-1">
                View History
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Horoscope
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Set your date of birth to unlock daily horoscopes.
            </p>
            <Link href="/dashboard/horoscope" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="gap-1">
                View Horoscope
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Plan info */}
      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Plan</CardTitle>
            <Badge variant="secondary">Free Trial</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You&apos;re on the free trial. Your first reading unlocks all
            sections for 7 days. After that, upgrade to keep full access.
          </p>
          <Link href="/pricing" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              View Plans
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
