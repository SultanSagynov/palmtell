"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReadingResultDisplay } from "@/components/reading-result-display";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { PalmAnalysis } from "@/types";

interface Reading {
  id: string;
  status: string;
  imageUrl?: string;
  analysisJson?: PalmAnalysis;
  createdAt: string;
  profile: {
    name: string;
    avatarEmoji?: string;
  };
}

export default function ReadingPage() {
  const params = useParams();
  const { user } = useUser();
  const [reading, setReading] = useState<Reading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReading() {
      if (!params.id || !user) return;

      try {
        const response = await fetch(`/api/readings/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch reading");
        }

        setReading(data.reading);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reading");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReading();

    // Poll for updates if reading is still processing
    const pollInterval = setInterval(() => {
      if (reading?.status === "pending" || reading?.status === "processing") {
        fetchReading();
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [params.id, user, reading?.status]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm">{error || "Reading not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (reading.status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "processing":
        return <Badge variant="secondary" className="gap-1"><Loader2 className="h-3 w-3 animate-spin" />Processing</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{reading.status}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            Palm Reading
            {reading.profile.avatarEmoji && (
              <span className="ml-2">{reading.profile.avatarEmoji}</span>
            )}
          </h1>
          <p className="mt-1 text-muted-foreground">
            For {reading.profile.name} • {new Date(reading.createdAt).toLocaleDateString()}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Processing State */}
      {(reading.status === "pending" || reading.status === "processing") && (
        <Card className="border-border/40">
          <CardContent className="flex items-center gap-4 pt-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="font-medium">
                {reading.status === "pending" ? "Analyzing your palm..." : "Processing analysis..."}
              </p>
              <p className="text-sm text-muted-foreground">
                This usually takes 30-60 seconds. You can refresh this page to check for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed State */}
      {reading.status === "failed" && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="font-medium">Analysis Failed</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't analyze your palm photo. This might be because no hand was detected in the image.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard/readings/new"}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed Reading */}
      {reading.status === "completed" && reading.analysisJson && (
        <ReadingResultDisplay 
          analysis={reading.analysisJson}
          profileName={reading.profile.name}
          imageUrl={reading.imageUrl}
          createdAt={reading.createdAt}
        />
      )}
    </div>
  );
}
