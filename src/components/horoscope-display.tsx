"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { 
  Calendar, 
  Clock, 
  Palette, 
  Heart, 
  TrendingUp,
  Star,
  Crown,
  Loader2
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  dob: string | null;
  avatarEmoji?: string;
}

interface DailyHoroscope {
  sign: string;
  date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  luckyNumber: string;
  luckyTime: string;
  dateRange: string;
}

interface MonthlyHoroscope {
  sign: string;
  month: string;
  year: number;
  overview: string;
  career: string;
  love: string;
  health: string;
  finance: string;
  keyDates: string[];
  theme: string;
}

interface HoroscopeDisplayProps {
  profiles: Profile[];
  selectedProfileId: string;
  onProfileChange: (profileId: string) => void;
}

export function HoroscopeDisplay({ profiles, selectedProfileId, onProfileChange }: HoroscopeDisplayProps) {
  const { user } = useUser();
  const [dailyHoroscope, setDailyHoroscope] = useState<DailyHoroscope | null>(null);
  const [monthlyHoroscope, setMonthlyHoroscope] = useState<MonthlyHoroscope | null>(null);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
  const [dailyError, setDailyError] = useState<string | null>(null);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  useEffect(() => {
    if (selectedProfile?.dob) {
      fetchDailyHoroscope();
    }
  }, [selectedProfileId, selectedProfile]);

  const fetchDailyHoroscope = async () => {
    if (!selectedProfile?.dob) return;

    setIsLoadingDaily(true);
    setDailyError(null);

    try {
      const response = await fetch(`/api/horoscope/daily?profile_id=${selectedProfileId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch daily horoscope");
      }

      setDailyHoroscope(data.horoscope);
    } catch (error) {
      setDailyError(error instanceof Error ? error.message : "Failed to load horoscope");
    } finally {
      setIsLoadingDaily(false);
    }
  };

  const fetchMonthlyHoroscope = async () => {
    if (!selectedProfile?.dob) return;

    setIsLoadingMonthly(true);
    setMonthlyError(null);

    try {
      const response = await fetch(`/api/horoscope/monthly?profile_id=${selectedProfileId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch monthly horoscope");
      }

      setMonthlyHoroscope(data.horoscope);
    } catch (error) {
      setMonthlyError(error instanceof Error ? error.message : "Failed to load monthly horoscope");
    } finally {
      setIsLoadingMonthly(false);
    }
  };

  if (!selectedProfile?.dob) {
    return (
      <Card className="border-border/40">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Date of Birth Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a date of birth to {selectedProfile?.name || "this profile"} to view horoscopes.
            </p>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Selection */}
      {profiles.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onProfileChange(profile.id)}
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
      )}

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly" onClick={fetchMonthlyHoroscope}>
            Monthly <Crown className="h-3 w-3 ml-1" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {isLoadingDaily ? (
            <Card className="border-border/40">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : dailyError ? (
            <Card className="border-destructive/50">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{dailyError}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={fetchDailyHoroscope}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : dailyHoroscope ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {dailyHoroscope.sign.charAt(0).toUpperCase() + dailyHoroscope.sign.slice(1)} Daily Horoscope
                    <Badge variant="outline">{dailyHoroscope.dateRange}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm leading-relaxed">{dailyHoroscope.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Heart className="h-4 w-4 mx-auto mb-1 text-red-500" />
                      <p className="text-xs font-medium">Compatibility</p>
                      <p className="text-sm">{dailyHoroscope.compatibility}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
                      <p className="text-xs font-medium">Mood</p>
                      <p className="text-sm">{dailyHoroscope.mood}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Palette className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs font-medium">Lucky Color</p>
                      <p className="text-sm">{dailyHoroscope.color}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                      <p className="text-xs font-medium">Lucky Time</p>
                      <p className="text-sm">{dailyHoroscope.luckyTime}</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Lucky Number</p>
                    <p className="text-2xl font-bold text-primary">{dailyHoroscope.luckyNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          {isLoadingMonthly ? (
            <Card className="border-border/40">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </CardContent>
            </Card>
          ) : monthlyError ? (
            <Card className="border-destructive/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Crown className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <h4 className="font-semibold mb-2">Pro Feature</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monthly horoscopes require a Pro subscription
                  </p>
                  <Button size="sm" className="gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : monthlyHoroscope ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {monthlyHoroscope.month} {monthlyHoroscope.year} Forecast
                    <Crown className="h-4 w-4 text-accent" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Monthly Theme</h4>
                    <p className="text-sm font-medium text-primary">{monthlyHoroscope.theme}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Overview</h4>
                    <p className="text-sm leading-relaxed">{monthlyHoroscope.overview}</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">💼 Career</h5>
                      <p className="text-xs text-muted-foreground">{monthlyHoroscope.career}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">❤️ Love</h5>
                      <p className="text-xs text-muted-foreground">{monthlyHoroscope.love}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">🏥 Health</h5>
                      <p className="text-xs text-muted-foreground">{monthlyHoroscope.health}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">💰 Finance</h5>
                      <p className="text-xs text-muted-foreground">{monthlyHoroscope.finance}</p>
                    </div>
                  </div>

                  {monthlyHoroscope.keyDates.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Dates</h4>
                      <div className="flex flex-wrap gap-2">
                        {monthlyHoroscope.keyDates.map((date, index) => (
                          <Badge key={index} variant="secondary">{date}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
