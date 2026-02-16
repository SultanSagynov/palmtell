"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Hand,
  Upload
} from "lucide-react";
import { PalmUpload } from "@/components/palm-upload";

export default function NewReadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isResume = searchParams.get("resume") === "true";
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [readingId, setReadingId] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
    
    if (isResume) {
      handleResumeReading();
    }
  }, [isResume]);

  const loadProfiles = async () => {
    try {
      const response = await fetch("/api/profiles");
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
        
        // Select default profile
        const defaultProfile = data.profiles?.find((p: any) => p.isDefault);
        if (defaultProfile) {
          setSelectedProfileId(defaultProfile.id);
        }
      }
    } catch (err) {
      console.error("Failed to load profiles:", err);
    }
  };

  const handleResumeReading = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Get temp reading token from cookie
      const cookies = document.cookie.split(';');
      const tempTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('temp_reading_token=')
      );

      if (!tempTokenCookie) {
        setError("No temporary reading found. Please upload a new palm photo.");
        setIsProcessing(false);
        return;
      }

      const tempToken = tempTokenCookie.split('=')[1];
      
      // Decode temp data
      const tempData = JSON.parse(Buffer.from(tempToken, 'base64url').toString());
      
      // Create reading with temp image
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: selectedProfileId,
          tempImageUrl: tempData.imageUrl,
          tempImageKey: tempData.imageKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create reading");
      }

      const { reading } = await response.json();
      setReadingId(reading.id);

      // Clear temp token cookie
      document.cookie = "temp_reading_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to reading result
      router.push(`/dashboard/readings/${reading.id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process reading");
      setIsProcessing(false);
    }
  };

  const handleNewUpload = async (file: File) => {
    if (!selectedProfileId) {
      setError("Please select a profile first");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("profileId", selectedProfileId);

      const response = await fetch("/api/readings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { reading } = await response.json();
      setReadingId(reading.id);

      // Redirect to reading result
      router.push(`/dashboard/readings/${reading.id}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto mb-6 animate-spin text-primary" />
              <h2 className="text-2xl font-semibold mb-4">
                {isResume ? "Processing Your Reading..." : "Uploading Palm Photo..."}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isResume 
                  ? "We're analyzing your palm photo using advanced AI. This will take just a moment."
                  : "Please wait while we upload and process your palm photo."
                }
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Photo uploaded successfully</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>AI analysis in progress...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold mb-4">
            {isResume ? "Welcome! Your Reading is Ready" : "New Palm Reading"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isResume 
              ? "We're processing your palm photo from the preview. You'll see your complete reading in just a moment."
              : "Upload a clear photo of your palm to get personalized insights about your personality, career, and life path."
            }
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-destructive font-medium">{error}</p>
                {isResume && (
                  <p className="text-xs text-muted-foreground mt-1">
                    You can upload a new photo below instead.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!isResume && (
          <>
            {/* Profile Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hand className="h-5 w-5" />
                  Select Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedProfileId(profile.id)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedProfileId === profile.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {profile.avatarEmoji || "👤"}
                        </div>
                        <div>
                          <div className="font-medium">{profile.name}</div>
                          {profile.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upload Component */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Palm Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PalmUpload
                  profileId={selectedProfileId}
                  onUploadSuccess={(readingId) => router.push(`/dashboard/readings/${readingId}`)}
                  onUploadError={(error) => setError(error)}
                />
                {!selectedProfileId && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Please select a profile before uploading
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {isResume && (
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-4">
                Your Reading is Being Processed
              </h2>
              <p className="text-muted-foreground mb-6">
                We have your palm photo from the preview and are now running the complete AI analysis. 
                You'll be redirected to your results automatically.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
