"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { projects } from "@/db/schema";

export async function getProjectsByProfileId(profileId: string) {
  const results = await db.query.projects.findMany({
    where: eq(projects.profileId, profileId),
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  });

  return results;
}
