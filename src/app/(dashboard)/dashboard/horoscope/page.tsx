"use client";

import { useState, useEffect } from "react";
import { HoroscopeDisplay } from "@/components/horoscope-display";
import { CompatibilityDisplay } from "@/components/compatibility-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { Star, Heart } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  dob: string | null;
  avatarEmoji?: string;
}

export default function HoroscopePage() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      if (!user) return;

      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        setProfiles(data.profiles || []);

        // Select default profile
        const defaultProfile = data.profiles?.find((p: Profile) => p.isDefault);
        if (defaultProfile) {
          setSelectedProfileId(defaultProfile.id);
        }
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();
  }, [user]);

  const profilesWithDob = profiles.filter(p => p.dob);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (profilesWithDob.length === 0) {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Horoscope & Compatibility</h1>
        <p className="mt-1 text-muted-foreground">
          Your daily and monthly horoscope, plus compatibility readings between profiles.
        </p>
      </div>

      <Tabs defaultValue="horoscope" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="horoscope" className="gap-2">
            <Star className="h-4 w-4" />
            Horoscope
          </TabsTrigger>
          <TabsTrigger value="compatibility" className="gap-2">
            <Heart className="h-4 w-4" />
            Compatibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="horoscope" className="space-y-6">
          <HoroscopeDisplay
            profiles={profilesWithDob}
            selectedProfileId={selectedProfileId}
            onProfileChange={setSelectedProfileId}
          />
        </TabsContent>

        <TabsContent value="compatibility" className="space-y-6">
          <CompatibilityDisplay profiles={profiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
