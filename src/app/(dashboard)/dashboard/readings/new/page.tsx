import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import type { Metadata } from "next";
import { DISCLAIMER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "New Reading",
};

export default function NewReadingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">New Palm Reading</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a clear photo of your palm to begin the AI analysis.
        </p>
      </div>

      {/* Upload area */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle>Upload Palm Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <p className="mt-4 text-sm font-medium">
              Drag & drop your palm photo here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WEBP, or HEIC up to 10MB
            </p>
            <div className="mt-6 flex gap-3">
              <Button className="gap-2" disabled>
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              <Button variant="outline" className="gap-2" disabled>
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Upload functionality coming in the next update.
            </p>
          </div>
        </CardContent>
      </Card>

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
