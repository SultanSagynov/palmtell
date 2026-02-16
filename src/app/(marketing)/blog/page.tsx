import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  ArrowRight,
  Hand,
  Star,
  Heart,
  Brain
} from "lucide-react";

export const metadata: Metadata = {
  title: "Palmistry Blog - Learn Palm Reading & Astrology | Palmtell",
  description: "Explore our comprehensive palmistry blog with guides on palm reading, astrology, and personal insights. Learn to read palms and understand your destiny.",
  keywords: "palmistry blog, palm reading guide, astrology articles, hand reading tips, palmistry basics",
  openGraph: {
    title: "Palmistry Blog - Learn Palm Reading & Astrology",
    description: "Explore our comprehensive palmistry blog with guides on palm reading, astrology, and personal insights.",
    type: "website",
  },
};

const blogPosts = [
  {
    slug: "beginner-guide-palm-reading",
    title: "Complete Beginner's Guide to Palm Reading",
    excerpt: "Learn the basics of palmistry with this comprehensive guide covering the major lines, mounts, and what they reveal about your personality.",
    category: "Palmistry Basics",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    featured: true,
    icon: Hand
  },
  {
    slug: "love-lines-relationship-palmistry",
    title: "Love Lines: What Your Palm Says About Relationships",
    excerpt: "Discover how to read relationship patterns in your palm, including marriage lines, heart line variations, and compatibility indicators.",
    category: "Relationships",
    readTime: "6 min read", 
    publishDate: "2024-01-12",
    featured: true,
    icon: Heart
  },
  {
    slug: "career-success-palm-reading",
    title: "Reading Your Career Path in Your Palm",
    excerpt: "Learn how the fate line, head line, and finger shapes reveal your professional strengths, career changes, and success potential.",
    category: "Career",
    readTime: "7 min read",
    publishDate: "2024-01-10",
    featured: true,
    icon: Brain
  },
  {
    slug: "palm-reading-myths-debunked",
    title: "5 Common Palm Reading Myths Debunked",
    excerpt: "Separate fact from fiction in palmistry. We debunk the most common misconceptions about palm reading and what your lines really mean.",
    category: "Palmistry Facts",
    readTime: "5 min read",
    publishDate: "2024-01-08",
    featured: false,
    icon: Star
  },
  {
    slug: "hand-shapes-personality-types",
    title: "Hand Shapes and Personality Types",
    excerpt: "Discover how the shape of your hand reveals your core personality traits, from earth hands to fire hands and everything in between.",
    category: "Personality",
    readTime: "6 min read",
    publishDate: "2024-01-05",
    featured: false,
    icon: Hand
  },
  {
    slug: "palmistry-history-ancient-wisdom",
    title: "The Ancient History of Palmistry",
    excerpt: "Explore the fascinating 5,000-year history of palm reading, from ancient India to modern AI-powered analysis.",
    category: "History",
    readTime: "9 min read",
    publishDate: "2024-01-03",
    featured: false,
    icon: BookOpen
  }
];

const categories = [
  "All Posts",
  "Palmistry Basics", 
  "Relationships",
  "Career",
  "Personality",
  "History",
  "Palmistry Facts"
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            Learn & Explore
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Palmistry Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover the ancient art of palm reading with our comprehensive guides, 
            tips, and insights. From beginner basics to advanced techniques, 
            unlock the secrets hidden in your hands.
          </p>
          <Link href="/free-reading">
            <Button size="lg" className="gap-2">
              <Hand className="h-5 w-5" />
              Try Palm Reading
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <Card key={index} className="border-border/40 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <post.icon className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      Read Article
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-semibold mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Badge 
                key={index} 
                variant={index === 0 ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12">All Articles</h2>
          <div className="grid gap-6">
            {regularPosts.map((post, index) => (
              <Card key={index} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                      <post.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          Read More
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-2xl mx-auto text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-8">
            Get the latest palmistry insights, tips, and guides delivered to your inbox. 
            Join our community of palm reading enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
            />
            <Button className="gap-2">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Ready to Read Your Own Palm?
          </h2>
          <p className="text-muted-foreground mb-8">
            Put your new knowledge to the test with our AI-powered palm reading. 
            Get instant insights about your personality, relationships, and life path.
          </p>
          <Link href="/free-reading">
            <Button size="lg" className="gap-2">
              <Hand className="h-5 w-5" />
              Start Free Palm Reading
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
