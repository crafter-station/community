import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-medium">Page Not Found</h2>
        <p className="mt-2 text-center text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/directory">Browse Directory</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
