import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Hand, LayoutDashboard, BookOpen, User, CreditCard, Star } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/readings", label: "My Readings", icon: BookOpen },
  { href: "/dashboard/profiles", label: "Profiles", icon: User },
  { href: "/dashboard/horoscope", label: "Horoscope", icon: Star },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-card/50 lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Hand className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Palmtell</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Hand className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Palmtell</span>
            </Link>
          </div>

          {/* Mobile nav links */}
          <nav className="flex items-center gap-4 overflow-x-auto lg:hidden">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-xs text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
