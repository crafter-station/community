import type { Metadata } from "next";
import { Suspense } from "react";

import { Header } from "@/components/layout/header";
import { SearchFilter } from "@/components/directory/search-filter";
import { MemberGrid } from "@/components/directory/member-grid";
import {
  getPublishedProfiles,
  getUniqueBackgrounds,
} from "@/actions/directory";

export const metadata: Metadata = {
  title: "Directorio",
  description:
    "Explora el directorio de builders tech en Perú. Encuentra desarrolladores, diseñadores, founders y más creadores de la comunidad.",
  openGraph: {
    title: "Directorio de Builders Tech | Crafter Station",
    description:
      "Explora el directorio de builders tech en Perú. Encuentra desarrolladores, diseñadores, founders y más.",
  },
};

type DirectoryPageProps = {
  searchParams: Promise<{ search?: string; background?: string }>;
};

async function DirectoryContent({
  searchParams,
}: {
  searchParams: { search?: string; background?: string };
}) {
  const [profiles, backgrounds] = await Promise.all([
    getPublishedProfiles({
      search: searchParams.search,
      background: searchParams.background,
    }),
    getUniqueBackgrounds(),
  ]);

  return (
    <>
      <SearchFilter backgrounds={backgrounds} totalCount={profiles.length} />
      <MemberGrid profiles={profiles} />
    </>
  );
}

export default async function DirectoryPage({
  searchParams,
}: DirectoryPageProps) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Community Directory</h1>
          <p className="mt-2 text-muted-foreground">
            Discover who&apos;s building at Crafter Station
          </p>
        </div>

        <div className="space-y-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            }
          >
            <DirectoryContent searchParams={params} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
