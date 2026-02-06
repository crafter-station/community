import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Sparkles, Globe } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { getPublishedProfiles, getProfileCount } from "@/actions/directory";

export const metadata: Metadata = {
  title: "Crafter Station | Comunidad de Builders Tech en Perú",
  description:
    "Únete al directorio de builders y creadores tech en Perú. Descubre quién está construyendo, conecta con personas afines y comparte tu proyecto.",
  openGraph: {
    title: "Crafter Station | Comunidad de Builders Tech en Perú",
    description:
      "Únete al directorio de builders y creadores tech en Perú. Descubre quién está construyendo y comparte tu proyecto.",
  },
};

// Revalidate landing page every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  const [profiles, totalCount] = await Promise.all([
    getPublishedProfiles(),
    getProfileCount(),
  ]);

  // Show up to 4 featured profiles
  const featuredProfiles = profiles.slice(0, 4);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Meet the <span className="text-primary">Crafter Station</span>{" "}
              Community
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              A directory of builders, designers, and creators. Discover
              who&apos;s building, connect with like-minded people, and share
              your journey.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/profile/new">
                  Join the Directory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/directory">Browse Members</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2 text-3xl font-bold">{totalCount}</div>
                <div className="text-sm text-muted-foreground">
                  Community Members
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2 text-3xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">
                  Builders & Creators
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2 text-3xl font-bold">Global</div>
                <div className="text-sm text-muted-foreground">
                  Community Reach
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Members */}
        {featuredProfiles.length > 0 && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-5xl px-4 py-16">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Featured Members</h2>
                  <p className="mt-1 text-muted-foreground">
                    Some of the amazing people in our community
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/directory">View All</Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {featuredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section>
          <div className="mx-auto max-w-5xl px-4 py-20 text-center">
            <h2 className="text-2xl font-bold">Ready to join?</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Create your profile in minutes and become part of the Crafter
              Station community. Share what you&apos;re building and connect
              with other creators.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/profile/new">
                Create Your Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary">[</span>
              <span className="font-semibold">Crafter Station</span>
              <span className="font-mono text-primary">]</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the future, together.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
