import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-primary">[</span>
          <span className="font-semibold">Crafter Station</span>
          <span className="font-mono text-primary">]</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/directory"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Directory
          </Link>

          <SignedIn>
            <Link
              href="/profile"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              My Profile
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Join</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
