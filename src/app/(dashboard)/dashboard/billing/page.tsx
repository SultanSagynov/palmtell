import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and payment methods.
        </p>
      </div>

      {/* Current plan */}
      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant="secondary">Free</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="text-sm font-medium">Free Trial</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Readings</p>
              <p className="text-sm font-medium">1 included</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profiles</p>
              <p className="text-sm font-medium">1 (self only)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/pricing">
              <Button className="gap-2">
                <CreditCard className="h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" disabled>
              <ExternalLink className="h-4 w-4" />
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment history placeholder */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No payments yet. Payment history will appear here once you upgrade
            to a paid plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
