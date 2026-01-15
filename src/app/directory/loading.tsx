import { Header } from "@/components/layout/header";

export default function DirectoryLoading() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-card" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-card" />
        </div>

        <div className="space-y-6">
          {/* Search skeleton */}
          <div className="h-10 w-full animate-pulse rounded bg-card" />

          {/* Filter pills skeleton */}
          <div className="flex gap-2">
            {["filter-1", "filter-2", "filter-3", "filter-4", "filter-5"].map(
              (id) => (
                <div
                  key={id}
                  className="h-6 w-20 animate-pulse rounded-full bg-card"
                />
              )
            )}
          </div>

          {/* Grid skeleton */}
          <div className="grid gap-4 sm:grid-cols-2">
            {["card-1", "card-2", "card-3", "card-4", "card-5", "card-6"].map(
              (id) => (
                <div
                  key={id}
                  className="h-32 animate-pulse rounded-lg border border-border bg-card"
                />
              )
            )}
          </div>
        </div>
      </main>
    </>
  );
}
