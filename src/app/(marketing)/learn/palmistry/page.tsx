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
  Star,
  ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "What is Palmistry? Complete Guide to Palm Reading | Palmtell",
  description: "Learn about palmistry and palm reading. Discover the history, major palm lines, and how AI-powered palm analysis works. Start your free palm reading today.",
  keywords: "palmistry, palm reading, what is palmistry, palm lines meaning, hand reading, chiromancy",
  openGraph: {
    title: "What is Palmistry? Complete Guide to Palm Reading",
    description: "Learn about palmistry and palm reading. Discover the history, major palm lines, and how AI-powered palm analysis works.",
    type: "article",
  },
};

const palmLines = [
  {
    name: "Life Line",
    icon: Heart,
    description: "Curves around the thumb, representing vitality, health, and major life changes.",
    meaning: "Length doesn't predict lifespan, but shows energy levels and life approach."
  },
  {
    name: "Head Line",
    icon: Brain,
    description: "Runs across the palm horizontally, revealing thinking patterns and mental approach.",
    meaning: "Shows how you process information, make decisions, and approach problems."
  },
  {
    name: "Heart Line",
    icon: Heart,
    description: "Located at the top of the palm, governing emotions and relationships.",
    meaning: "Reveals your emotional nature, relationship patterns, and capacity for love."
  },
  {
    name: "Fate Line",
    icon: TrendingUp,
    description: "Vertical line running up the palm, indicating career path and life direction.",
    meaning: "Shows how external forces and personal choices shape your destiny."
  }
];

const palmMounts = [
  { name: "Mount of Venus", trait: "Love & Passion" },
  { name: "Mount of Jupiter", trait: "Leadership & Ambition" },
  { name: "Mount of Saturn", trait: "Discipline & Responsibility" },
  { name: "Mount of Apollo", trait: "Creativity & Success" },
  { name: "Mount of Mercury", trait: "Communication & Business" },
  { name: "Mount of Mars", trait: "Courage & Energy" },
  { name: "Mount of Luna", trait: "Intuition & Imagination" }
];

export default function PalmistryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            Ancient Wisdom Meets Modern AI
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            What is Palmistry?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Palmistry, also known as chiromancy, is the ancient art of reading palms to reveal 
            personality traits, life patterns, and future possibilities. Discover how this 
            5,000-year-old practice works and how modern AI makes it more accessible than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-reading">
              <Button size="lg" className="gap-2">
                <Hand className="h-5 w-5" />
                Try Free Palm Reading
              </Button>
            </Link>
            <Link href="/learn/palm-lines">
              <Button variant="outline" size="lg" className="gap-2">
                Learn Palm Lines
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            The Ancient Art of Palm Reading
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">5,000 Years of History</h3>
              <p className="text-muted-foreground mb-4">
                Palmistry originated in ancient India and China, spreading through Egypt, Greece, 
                and Rome. Hindu scriptures mention palm reading as early as 3000 BCE, making it 
                one of humanity's oldest divination practices.
              </p>
              <p className="text-muted-foreground mb-4">
                Notable practitioners throughout history include Aristotle, who wrote about 
                palmistry in his works, and Julius Caesar, who was said to judge his men by 
                their palms.
              </p>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Practiced for over 5,000 years</span>
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Ancient India</h4>
                  <p className="text-sm text-muted-foreground">
                    Hasta Samudrika Shastra - the original palm reading texts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Ancient Greece</h4>
                  <p className="text-sm text-muted-foreground">
                    Aristotle documented palm reading principles in 350 BCE
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Modern Era</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis makes palmistry accessible worldwide
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Major Palm Lines */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            The Four Major Palm Lines
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {palmLines.map((line, index) => (
              <Card key={index} className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <line.icon className="h-6 w-6 text-primary" />
                    </div>
                    {line.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{line.description}</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">What it reveals:</p>
                    <p className="text-sm text-muted-foreground">{line.meaning}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Palm Mounts */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            The Seven Mounts of the Palm
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            The raised areas of your palm reveal different aspects of your personality and potential.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palmMounts.map((mount, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{mount.name}</h3>
                  <p className="text-sm text-muted-foreground">{mount.trait}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern AI Palmistry */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold mb-6">
            AI-Powered Palm Reading
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Modern technology brings ancient wisdom to your fingertips. Our AI analyzes your palm 
            using advanced computer vision, providing instant, detailed readings based on traditional 
            palmistry principles.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload Photo</h3>
              <p className="text-sm text-muted-foreground">Take a clear photo of your palm</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">Advanced AI reads your palm lines</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Insights</h3>
              <p className="text-sm text-muted-foreground">Receive detailed personality insights</p>
            </div>
          </div>
          <Link href="/free-reading">
            <Button size="lg" className="gap-2">
              <Hand className="h-5 w-5" />
              Start Your Free Reading
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is palmistry scientifically accurate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Palmistry is an ancient art form used for entertainment and self-reflection. 
                  While not scientifically proven, many find palm readings provide valuable 
                  insights for personal growth and decision-making.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Which hand should I read?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Traditionally, the dominant hand shows your conscious mind and current path, 
                  while the non-dominant hand reveals your subconscious and inherited traits. 
                  Most modern readings focus on the dominant hand.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do palm lines change over time?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Palm lines can change as you grow and evolve. This is why some people 
                  get multiple readings throughout their lives to track their personal development 
                  and changing life circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Discover Your Palm's Secrets?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands who have unlocked insights about their personality, relationships, 
            and life path through AI-powered palm reading.
          </p>
          <Link href="/free-reading">
            <Button size="lg" className="gap-2">
              <Hand className="h-5 w-5" />
              Get Your Free Palm Reading
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            No credit card required • Results in under 60 seconds
          </p>
        </div>
      </section>
    </div>
  );
}
