"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaPipeHands } from "@/hooks/use-mediapipe-hands";
import { Hand, Upload, Camera, AlertCircle, Calendar, Sparkles, CheckCircle } from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";

export default function PalmUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const router = useRouter();
  const { captureFromCamera, validateHandInImage, isLoading, error: cameraError } = useMediaPipeHands();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file is too large. Maximum size is 10MB");
      return;
    }

    // Client-side hand validation
    const validation = await validateHandInImage(file);
    if (!validation.handsDetected) {
      setError("No hand detected in the image. Please upload a clear photo of your palm");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCameraCapture = async () => {
    setError(null);
    
    try {
      const capturedFile = await captureFromCamera();
      if (capturedFile) {
        setSelectedFile(capturedFile);
        setPreviewUrl(URL.createObjectURL(capturedFile));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture photo");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please select or capture a palm photo");
      return;
    }

    if (!dob.day || !dob.month || !dob.year) {
      setError("Please enter your complete date of birth");
      return;
    }

    // Validate date
    const birthDate = new Date(parseInt(dob.year), parseInt(dob.month) - 1, parseInt(dob.day));
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      setError("Please enter a valid date of birth");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('dob', birthDate.toISOString());

      const response = await fetch('/api/palm/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to confirmation page
        router.push('/palm/confirm');
      } else {
        setError(data.error || 'Failed to upload palm data');
      }
    } catch (err) {
      setError('Failed to upload palm data. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Hand className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-bold text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Setup Your Palm Reading
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Upload your palm photo and birth date to get started
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Palm Photo */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Hand className="h-4 w-4 text-white" />
                  </div>
                  Step 1: Palm Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedFile ? (
                  <div className="space-y-4">
                    {/* Upload Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="file-upload" className="sr-only">
                          Upload palm photo
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900 dark:hover:to-purple-900 transition-all duration-200"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-indigo-700 dark:text-indigo-300">Choose File</span>
                        </Button>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-24 flex flex-col gap-2 border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900 transition-all duration-200"
                        onClick={handleCameraCapture}
                        disabled={isLoading}
                      >
                        <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">
                          {isLoading ? "Opening Camera..." : "Take Photo"}
                        </span>
                      </Button>
                    </div>

                    {/* Photo Tips */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">📸 Photo Tips:</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                        <li>• Open your hand fully with palm facing camera</li>
                        <li>• Use good lighting, avoid shadows</li>
                        <li>• Ensure palm lines are clearly visible</li>
                        <li>• Hold hand steady and flat</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative">
                      <div className="w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-green-200 dark:border-green-700 shadow-lg">
                        <img
                          src={previewUrl!}
                          alt="Palm preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        Valid Palm
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Change Photo
                      </Button>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">{cameraError}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Date of Birth */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  Step 2: Date of Birth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">
                      ✨ We need this for horoscope insights and personalized readings
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="day">Day</Label>
                      <select
                        id="day"
                        value={dob.day}
                        onChange={(e) => setDob(prev => ({ ...prev, day: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      >
                        <option value="">Day</option>
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="month">Month</Label>
                      <select
                        id="month"
                        value={dob.month}
                        onChange={(e) => setDob(prev => ({ ...prev, month: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      >
                        <option value="">Month</option>
                        {months.map(month => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <select
                        id="year"
                        value={dob.year}
                        onChange={(e) => setDob(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      >
                        <option value="">Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!selectedFile || !dob.day || !dob.month || !dob.year || isUploading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Continue to Confirmation
                </>
              )}
            </Button>
          </form>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground">
            {DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
