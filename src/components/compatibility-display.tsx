"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import { 
  Heart, 
  MessageCircle, 
  Target, 
  Home,
  Crown,
  Loader2,
  Users
} from "lucide-react";
// import { CompatibilityReading } from "@/lib/compatibility";

interface CompatibilityReading {
  profileA: {
    name: string;
    sign?: string;
  };
  profileB: {
    name: string;
    sign?: string;
  };
  overallScore: number;
  summary: string;
  categories: {
    communication: { score: number; description: string };
    emotional: { score: number; description: string };
    intellectual: { score: number; description: string };
    physical: { score: number; description: string };
    strengths: string[];
    challenges: string[];
  };
  zodiacCompatibility?: {
    signA: string;
    signB: string;
    description: string;
  };
}

interface Profile {
  id: string;
  name: string;
  dob: string | null;
  avatarEmoji?: string;
  isDefault: boolean;
}

interface CompatibilityDisplayProps {
  profiles: Profile[];
}

export function CompatibilityDisplay({ profiles }: CompatibilityDisplayProps) {
  const { user } = useUser();
  const [selectedProfileA, setSelectedProfileA] = useState<string>("");
  const [selectedProfileB, setSelectedProfileB] = useState<string>("");
  const [compatibility, setCompatibility] = useState<CompatibilityReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter profiles that have completed readings
  const profilesWithReadings = profiles.filter(p => p.dob); // Simplified check

  const handleGenerateCompatibility = async () => {
    if (!selectedProfileA || !selectedProfileB) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/readings/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id_a: selectedProfileA,
          profile_id_b: selectedProfileB,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate compatibility reading");
      }

      setCompatibility(data.compatibility);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate compatibility");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (profilesWithReadings.length < 2) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Need More Profiles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You need at least 2 profiles with completed palm readings to generate compatibility reports.
            </p>
            <Button variant="outline">Add Profile</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Selection */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Compatibility Reading
            <Crown className="h-4 w-4 text-accent" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First Person</label>
              <div className="space-y-2">
                {profilesWithReadings.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfileA(profile.id)}
                    disabled={profile.id === selectedProfileB}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedProfileA === profile.id
                        ? "bg-primary text-primary-foreground"
                        : profile.id === selectedProfileB
                        ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {profile.avatarEmoji && (
                      <span className="mr-2">{profile.avatarEmoji}</span>
                    )}
                    {profile.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Second Person</label>
              <div className="space-y-2">
                {profilesWithReadings.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfileB(profile.id)}
                    disabled={profile.id === selectedProfileA}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedProfileB === profile.id
                        ? "bg-primary text-primary-foreground"
                        : profile.id === selectedProfileA
                        ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {profile.avatarEmoji && (
                      <span className="mr-2">{profile.avatarEmoji}</span>
                    )}
                    {profile.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerateCompatibility}
            disabled={!selectedProfileA || !selectedProfileB || isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
            {isLoading ? "Analyzing Compatibility..." : "Generate Compatibility Report"}
          </Button>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compatibility Results */}
      {compatibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <Card className="border-border/40">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    {compatibility.profileA.emoji && (
                      <span className="text-2xl">{compatibility.profileA.emoji}</span>
                    )}
                    <p className="font-medium">{compatibility.profileA.name}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                  <div className="text-center">
                    {compatibility.profileB.emoji && (
                      <span className="text-2xl">{compatibility.profileB.emoji}</span>
                    )}
                    <p className="font-medium">{compatibility.profileB.name}</p>
                  </div>
                </div>
                
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(compatibility.overallScore)}`}>
                  {compatibility.overallScore}%
                </div>
                <p className="text-sm text-muted-foreground mb-4">Overall Compatibility</p>
                
                <Progress 
                  value={compatibility.overallScore} 
                  className="w-full max-w-sm mx-auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Compatibility Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{compatibility.summary}</p>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Communication</span>
                      <span className={`font-bold ${getScoreColor(compatibility.categories.communication.score)}`}>
                        {compatibility.categories.communication.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{compatibility.categories.communication.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Emotional</span>
                      <span className={`font-bold ${getScoreColor(compatibility.categories.emotional.score)}`}>
                        {compatibility.categories.emotional.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{compatibility.categories.emotional.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Home className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Lifestyle</span>
                      <span className={`font-bold ${getScoreColor(compatibility.categories.lifestyle.score)}`}>
                        {compatibility.categories.lifestyle.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{compatibility.categories.lifestyle.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Target className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Goals</span>
                      <span className={`font-bold ${getScoreColor(compatibility.categories.goals.score)}`}>
                        {compatibility.categories.goals.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{compatibility.categories.goals.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="text-green-600">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compatibility.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="text-yellow-600">Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compatibility.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0" />
                      <p className="text-sm">{challenge}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advice */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Relationship Advice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{compatibility.advice}</p>
            </CardContent>
          </Card>

          {/* Zodiac Compatibility */}
          {compatibility.zodiacCompatibility && (
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Zodiac Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <Badge variant="outline">
                    {compatibility.zodiacCompatibility.signA.charAt(0).toUpperCase() + 
                     compatibility.zodiacCompatibility.signA.slice(1)}
                  </Badge>
                  <Heart className="h-4 w-4 text-red-500" />
                  <Badge variant="outline">
                    {compatibility.zodiacCompatibility.signB.charAt(0).toUpperCase() + 
                     compatibility.zodiacCompatibility.signB.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">{compatibility.zodiacCompatibility.description}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
