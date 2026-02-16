import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Hand, 
  Heart, 
  Brain, 
  TrendingUp, 
  Clock,
  Zap,
  Shield,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Palm Lines Meaning: Complete Guide to Reading Palm Lines | Palmtell",
  description: "Learn the meaning of palm lines including life line, heart line, head line, and fate line. Discover what your palm lines reveal about your personality and future.",
  keywords: "palm lines meaning, life line, heart line, head line, fate line, palm reading lines, hand lines meaning",
  openGraph: {
    title: "Palm Lines Meaning: Complete Guide to Reading Palm Lines",
    description: "Learn the meaning of palm lines including life line, heart line, head line, and fate line. Discover what your palm lines reveal about your personality and future.",
    type: "article",
  },
};

const majorLines = [
  {
    name: "Life Line",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "The most prominent line curving around the thumb",
    location: "Starts between thumb and index finger, curves around the thumb base",
    meanings: [
      "Physical vitality and energy levels",
      "Major life changes and transitions", 
      "Health and wellness indicators",
      "Life approach and general attitude"
    ],
    myths: [
      "❌ Length does NOT predict lifespan",
      "❌ Breaks don't mean death or illness",
      "✅ Shows energy and life force",
      "✅ Reveals how you handle challenges"
    ]
  },
  {
    name: "Head Line",
    icon: Brain,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Horizontal line across the palm revealing mental patterns",
    location: "Runs horizontally across the palm, may connect to or separate from life line",
    meanings: [
      "Thinking style and mental approach",
      "Decision-making patterns",
      "Intellectual interests and abilities",
      "Communication style"
    ],
    myths: [
      "❌ Doesn't measure intelligence",
      "❌ Short line doesn't mean 'dumb'",
      "✅ Shows how you process information",
      "✅ Reveals problem-solving approach"
    ]
  },
  {
    name: "Heart Line",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    description: "Top horizontal line governing emotions and relationships",
    location: "Runs horizontally at the top of the palm, below the fingers",
    meanings: [
      "Emotional nature and expression",
      "Relationship patterns and preferences",
      "Capacity for love and intimacy",
      "Social connections and empathy"
    ],
    myths: [
      "❌ Doesn't predict specific relationships",
      "❌ Breaks don't mean heartbreak",
      "✅ Shows emotional approach to love",
      "✅ Reveals relationship priorities"
    ]
  },
  {
    name: "Fate Line",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Vertical line indicating career path and life direction",
    location: "Runs vertically up the center of the palm (not everyone has one)",
    meanings: [
      "Career path and professional direction",
      "Life purpose and calling",
      "External influences on your path",
      "Achievement and recognition potential"
    ],
    myths: [
      "❌ Missing line doesn't mean no success",
      "❌ Doesn't guarantee specific career",
      "✅ Shows how external forces affect you",
      "✅ Reveals drive for achievement"
    ]
  }
];

const minorLines = [
  { name: "Sun Line", meaning: "Fame, creativity, and success", icon: "☀️" },
  { name: "Mercury Line", meaning: "Health, business acumen", icon: "💼" },
  { name: "Marriage Lines", meaning: "Significant relationships", icon: "💕" },
  { name: "Travel Lines", meaning: "Important journeys", icon: "✈️" },
  { name: "Children Lines", meaning: "Potential for children", icon: "👶" },
  { name: "Money Lines", meaning: "Financial potential", icon: "💰" }
];

const lineCharacteristics = [
  {
    characteristic: "Deep Lines",
    meaning: "Strong influence, prominent traits",
    icon: Shield
  },
  {
    characteristic: "Faint Lines", 
    meaning: "Subtle influence, developing traits",
    icon: Clock
  },
  {
    characteristic: "Broken Lines",
    meaning: "Changes, transitions, new chapters",
    icon: Zap
  },
  {
    characteristic: "Forked Lines",
    meaning: "Multiple paths, diverse interests",
    icon: TrendingUp
  }
];

export default function PalmLinesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            Complete Palm Lines Guide
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Palm Lines Meaning
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover what your palm lines reveal about your personality, relationships, 
            career, and life path. Learn to read the four major lines and understand 
            their true meanings beyond common myths.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-reading">
              <Button size="lg" className="gap-2">
                <Hand className="h-5 w-5" />
                Analyze My Palm Lines
              </Button>
            </Link>
            <Link href="/learn/palmistry">
              <Button variant="outline" size="lg" className="gap-2">
                Learn Palmistry Basics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Major Palm Lines */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            The Four Major Palm Lines
          </h2>
          <div className="space-y-12">
            {majorLines.map((line, index) => (
              <Card key={index} className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className={`p-3 ${line.bgColor} rounded-lg`}>
                      <line.icon className={`h-8 w-8 ${line.color}`} />
                    </div>
                    {line.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg">{line.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Location on Palm:</h4>
                    <p className="text-muted-foreground">{line.location}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">What It Reveals:</h4>
                      <ul className="space-y-2">
                        {line.meanings.map((meaning, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                            <span className="text-sm text-muted-foreground">{meaning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Myths vs Reality:</h4>
                      <ul className="space-y-2">
                        {line.myths.map((myth, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {myth}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Line Characteristics */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Understanding Line Characteristics
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            The depth, clarity, and patterns of your palm lines provide additional insights.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {lineCharacteristics.map((char, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <char.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{char.characteristic}</h3>
                  <p className="text-sm text-muted-foreground">{char.meaning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Minor Lines */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Minor Palm Lines
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Additional lines that may appear on your palm, each with specific meanings.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {minorLines.map((line, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl mb-2">{line.icon}</div>
                  <h3 className="font-semibold mb-2">{line.name}</h3>
                  <p className="text-sm text-muted-foreground">{line.meaning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Not everyone has all minor lines. Their presence or absence doesn't indicate 
              good or bad fortune—just different life paths and focuses.
            </p>
          </div>
        </div>
      </section>

      {/* How to Read Your Lines */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            How to Read Your Palm Lines
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Use Your Dominant Hand</h3>
              <p className="text-sm text-muted-foreground">
                Your dominant hand shows your conscious mind and current path
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Look at Line Quality</h3>
              <p className="text-sm text-muted-foreground">
                Deep, clear lines show strong traits; faint lines show developing ones
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Consider the Whole Hand</h3>
              <p className="text-sm text-muted-foreground">
                Lines work together—look at patterns, not individual lines in isolation
              </p>
            </div>
          </div>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Important Reminder</h3>
              <p className="text-sm text-muted-foreground">
                Palm reading is for entertainment and self-reflection. Your lines don't 
                determine your fate—they reflect tendencies and potentials that can guide 
                personal growth and decision-making.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Discover What Your Lines Reveal?
          </h2>
          <p className="text-muted-foreground mb-8">
            Get an AI-powered analysis of your palm lines with detailed insights about 
            your personality, relationships, and life path.
          </p>
          <Link href="/free-reading">
            <Button size="lg" className="gap-2">
              <Hand className="h-5 w-5" />
              Analyze My Palm Lines Now
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Free analysis • No registration required • Results in 60 seconds
          </p>
        </div>
      </section>
    </div>
  );
}
