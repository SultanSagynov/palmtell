"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Hand, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { useMediaPipeHands } from "@/hooks/use-mediapipe-hands";
import Link from "next/link";
import { DISCLAIMER } from "@/lib/constants";

interface AnalysisPreview {
  personality: {
    summary: string;
    traits: string[];
  };
}

export default function TryPage() {
  const [uploadMethod, setUploadMethod] = useState<"camera" | "file" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPreview, setAnalysisPreview] = useState<AnalysisPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { validateHandInImage, isLoading: isValidating, error: handDetectionError } = useMediaPipeHands();

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setUploadMethod("camera");
    } catch (err) {
      setError("Camera access denied. Please use file upload instead.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setUploadMethod(null);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "palm-photo.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      }
    }, "image/jpeg", 0.8);
  }, [stopCamera]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadMethod("file");
    setError(null);
  }, []);

  const uploadAndAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      const response = await fetch("/api/readings/temp", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
      
      const { tempReadingToken } = await response.json();
      
      // Store token in cookie for later use
      document.cookie = `temp_reading_token=${tempReadingToken}; path=/; max-age=3600; SameSite=Strict`;
      
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // Simulate analysis time (3-5 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Show preview with blurred content
      setAnalysisPreview({
        personality: {
          summary: "You possess a unique blend of analytical thinking and creative intuition. Your palm reveals strong leadership qualities and a natural ability to connect with others.",
          traits: ["Analytical", "Creative", "Empathetic", "Determined"]
        }
      });
      
      setIsAnalyzing(false);
      setShowPreview(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  }, [selectedFile]);

  const reset = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadMethod(null);
    setAnalysisPreview(null);
    setShowPreview(false);
    setError(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    stopCamera();
  }, [stopCamera]);

  if (showPreview && analysisPreview) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Analysis Complete
            </Badge>
            <h1 className="font-serif text-4xl font-bold mb-4">
              Your Palm Reading Preview
            </h1>
            <p className="text-muted-foreground">
              Here's a glimpse of what your palm reveals about you.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Hand className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Personality Insights</h2>
              </div>
              
              <p className="text-lg leading-relaxed mb-6">
                {analysisPreview.personality.summary}
              </p>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Traits:</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisPreview.personality.traits.map((trait, index) => (
                    <Badge key={index} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Blurred sections */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="blur-sm opacity-50 pointer-events-none">
                    <h3 className="font-semibold mb-3">Life Path Analysis</h3>
                    <p className="text-muted-foreground">
                      Your life line indicates a journey filled with meaningful experiences and personal growth. The depth and clarity of this line suggests...
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-4 text-center">
                      <EyeOff className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Unlock Full Reading</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="blur-sm opacity-50 pointer-events-none">
                    <h3 className="font-semibold mb-3">Career & Success</h3>
                    <p className="text-muted-foreground">
                      Your palm reveals strong indicators for success in fields that combine analytical thinking with creative expression...
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-4 text-center">
                      <EyeOff className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Unlock Full Reading</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Create a Free Account to Unlock Your Full Reading
              </h2>
              <p className="text-muted-foreground mb-6">
                Get complete insights about your personality, relationships, career path, 
                health indicators, and lucky numbers. Full access for 7 days, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2">
                    <Eye className="h-5 w-5" />
                    Unlock Full Reading
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={reset}>
                  Try Different Photo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Your photo is saved securely. After registration, you'll see your complete reading immediately.
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-8">
            {DISCLAIMER}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold mb-4">
            Try Free Palm Reading
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload a photo of your palm to get started. No account needed for preview.
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {!uploadMethod && !selectedFile && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={startCamera}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Use Camera</h3>
                <p className="text-sm text-muted-foreground">
                  Take a photo directly with your device camera
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => fileInputRef.current?.click()}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload File</h3>
                <p className="text-sm text-muted-foreground">
                  Choose an existing photo from your device
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {uploadMethod === "camera" && !selectedFile && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-blue-500/90 text-blue-900 px-3 py-2 rounded-lg text-sm text-center">
                    Position your palm facing the camera and click capture
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={capturePhoto}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {previewUrl && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Photo Preview</h3>
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Palm preview" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={uploadAndAnalyze}
                  disabled={isUploading || isAnalyzing}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Palm...
                    </>
                  ) : (
                    <>
                      <Hand className="h-4 w-4 mr-2" />
                      Analyze My Palm
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={reset} disabled={isUploading || isAnalyzing}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Tips for Best Results</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                "Use good lighting - natural daylight works best",
                "Open your hand fully with fingers spread slightly", 
                "Hold your palm flat facing the camera",
                "Make sure all major lines are clearly visible"
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          {DISCLAIMER}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
