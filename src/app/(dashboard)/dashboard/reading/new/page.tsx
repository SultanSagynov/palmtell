import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NewReadingContent } from "./new-reading-content";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-6 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
            <p className="text-muted-foreground">
              Please wait while we prepare your reading session.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewReadingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewReadingContent />
    </Suspense>
  );
}
