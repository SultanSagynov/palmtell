import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profiles",
};

export default function ProfilesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Profiles</h1>
          <p className="mt-1 text-muted-foreground">
            Manage profiles for yourself and loved ones. Each profile gets its
            own readings, horoscope, and insights.
          </p>
        </div>
        <Button className="gap-2" disabled>
          <Plus className="h-4 w-4" />
          Add Profile
        </Button>
      </div>

      {/* Default profile placeholder */}
      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Me</CardTitle>
                <p className="text-xs text-muted-foreground">Default profile</p>
              </div>
            </div>
            <Badge variant="secondary">Default</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium">Not set</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Readings</p>
              <p className="text-sm font-medium">0</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Zodiac Sign</p>
              <p className="text-sm font-medium">Set DOB to unlock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-border/40 bg-muted/20">
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Add a date of
            birth to unlock horoscope and lucky numbers for each profile.
            Upgrade to Pro to create up to 3 profiles and read palms for your
            loved ones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
