"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PalmUpload } from "@/components/palm-upload";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { DISCLAIMER } from "@/lib/constants";

export default function NewReadingPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        setProfiles(data.profiles || []);
        
        // Select default profile
        const defaultProfile = data.profiles?.find((p: any) => p.isDefault);
        if (defaultProfile) {
          setSelectedProfileId(defaultProfile.id);
        }
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const handleUploadSuccess = (readingId: string) => {
    router.push(`/dashboard/readings/${readingId}`);
  };

  const handleUploadError = (error: string) => {
    // TODO: Show toast notification
    console.error("Upload error:", error);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">New Palm Reading</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a clear photo of your palm to begin the AI analysis.
        </p>
      </div>

      {/* Profile Selection */}
      {profiles.length > 1 && (
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-base">Reading For</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedProfileId === profile.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {profile.avatarEmoji && (
                    <span className="mr-1">{profile.avatarEmoji}</span>
                  )}
                  {profile.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Component */}
      {selectedProfileId && (
        <PalmUpload
          profileId={selectedProfileId}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      )}

      {/* Tips */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Photo Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "Use good, natural lighting",
              "Open your hand fully with fingers slightly spread",
              "Hold your palm flat and facing the camera",
              "Ensure all major palm lines are clearly visible",
              "Avoid shadows across the palm",
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}
