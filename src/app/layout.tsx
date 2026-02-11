import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Palmtell — AI Palm Reading",
    template: "%s | Palmtell",
  },
  description:
    "AI-powered palm reading — discover your personality, life path, and career insights from your palm.",
  keywords: [
    "palm reading",
    "AI palmistry",
    "online palm reading",
    "personality test",
    "career advice",
  ],
  openGraph: {
    title: "Palmtell — AI Palm Reading",
    description:
      "Upload a photo of your palm and get instant AI-powered insights about your personality, career, and life path.",
    type: "website",
    siteName: "Palmtell",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palmtell — AI Palm Reading",
    description:
      "Upload a photo of your palm and get instant AI-powered insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#5B4FCF",
          colorBackground: "#0F0E1A",
          colorText: "#F2F2F2",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
