import Link from "next/link";
import { Calendar, ArrowRight, Star, Shield, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Event management made simple
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance leading-tight max-w-3xl">
            Discover events that matter to <span className="text-primary">you</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl text-pretty leading-relaxed">
            Browse curated events, leave honest reviews, and manage everything from one powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/85 transition-colors"
            >
              Browse events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              Create an account
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <h2 className="text-2xl font-bold text-center text-foreground mb-12 text-balance">
              Everything you need in one place
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Calendar,
                  title: "Browse Events",
                  description:
                    "Explore upcoming events filtered by location, date, or price. Never miss what you love.",
                },
                {
                  icon: Star,
                  title: "Rate & Review",
                  description:
                    "Leave honest reviews and star ratings. Help the community make better decisions.",
                },
                {
                  icon: Shield,
                  title: "Admin Controls",
                  description:
                    "Full CRUD management for admins — create, edit, delete events and moderate feedback.",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-xl border border-border bg-background p-6 flex flex-col gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <feat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground text-balance mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join EventHub today and start exploring events near you.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-primary/85 transition-colors"
          >
            <Users className="h-4 w-4" />
            Sign up for free
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground font-mono">
        &copy; {new Date().getFullYear()} EventHub &mdash; Built with Next.js & Spring Boot
      </footer>
    </div>
  );
}
