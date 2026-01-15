"use server";

import { eq, ilike, or, and, desc } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export type DirectoryFilters = {
  search?: string;
  background?: string;
};

export async function getPublishedProfiles(filters?: DirectoryFilters) {
  const conditions = [eq(profiles.isPublished, true)];

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(profiles.fullName, searchTerm),
        ilike(profiles.bio, searchTerm),
        ilike(profiles.background, searchTerm),
        ilike(profiles.workingOn, searchTerm)
      )!
    );
  }

  if (filters?.background) {
    conditions.push(ilike(profiles.background, `%${filters.background}%`));
  }

  const results = await db.query.profiles.findMany({
    where: and(...conditions),
    orderBy: [desc(profiles.createdAt)],
  });

  return results;
}

export async function getProfileCount() {
  const results = await db.query.profiles.findMany({
    where: eq(profiles.isPublished, true),
    columns: { id: true },
  });

  return results.length;
}

export async function getUniqueBackgrounds() {
  const results = await db.query.profiles.findMany({
    where: eq(profiles.isPublished, true),
    columns: { background: true },
  });

  const backgrounds = [...new Set(results.map((p) => p.background))];
  return backgrounds.sort();
}
