"use server";

import { eq, ilike, or, and, asc } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export type DirectoryFilters = {
  search?: string;
  background?: string;
  country?: string;
  city?: string;
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
        ilike(profiles.workingOn, searchTerm),
      )!,
    );
  }

  if (filters?.background) {
    conditions.push(ilike(profiles.background, `%${filters.background}%`));
  }

  if (filters?.country) {
    conditions.push(eq(profiles.country, filters.country));
  }

  if (filters?.city) {
    conditions.push(eq(profiles.city, filters.city));
  }

  const results = await db.query.profiles.findMany({
    where: and(...conditions),
    orderBy: [asc(profiles.codeId)],
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

export async function getUniqueCountries() {
  const results = await db.query.profiles.findMany({
    where: eq(profiles.isPublished, true),
    columns: { country: true },
  });

  const countries = [...new Set(results.map((p) => p.country))];
  return countries.sort();
}

export async function getUniqueCities() {
  const results = await db.query.profiles.findMany({
    where: eq(profiles.isPublished, true),
    columns: { city: true },
  });

  const cities = [...new Set(results.map((p) => p.city))];
  return cities.sort();
}
