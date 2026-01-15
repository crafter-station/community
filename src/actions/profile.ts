"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { nanoid } from "nanoid";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import type { ProfileFormValues } from "@/lib/validations";
import { profileFormSchema } from "@/lib/validations";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getCurrentUserProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.clerkUserId, userId),
  });

  return profile ?? null;
}

export async function getProfileBySlug(slug: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.slug, slug),
  });

  return profile ?? null;
}

export async function checkSlugAvailability(
  slug: string,
  excludeUserId?: string
): Promise<boolean> {
  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.slug, slug),
  });

  if (!existing) {
    return true;
  }

  // If we're excluding a user (for edit), check if it's their own slug
  if (excludeUserId && existing.clerkUserId === excludeUserId) {
    return true;
  }

  return false;
}

export async function generateSlugFromName(name: string): Promise<string> {
  const baseSlug = slugify(name, { lower: true, strict: true });

  // Check if base slug is available
  const isAvailable = await checkSlugAvailability(baseSlug);
  if (isAvailable) {
    return baseSlug;
  }

  // Add a short unique suffix
  return `${baseSlug}-${nanoid(4)}`;
}

export async function createProfile(
  data: ProfileFormValues & { photoUrl: string }
): Promise<ActionResult<{ slug: string }>> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user already has a profile
  const existingProfile = await getCurrentUserProfile();
  if (existingProfile) {
    return { success: false, error: "Profile already exists" };
  }

  // Validate data
  const validationResult = profileFormSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message ?? "Invalid data",
    };
  }

  // Check slug availability
  const slugAvailable = await checkSlugAvailability(data.slug);
  if (!slugAvailable) {
    return { success: false, error: "This URL is already taken" };
  }

  try {
    await db.insert(profiles).values({
      clerkUserId: userId,
      slug: data.slug,
      fullName: data.fullName,
      photoUrl: data.photoUrl,
      bio: data.bio,
      background: data.background,
      country: data.country,
      city: data.city,
      workingOn: data.workingOn || null,
      lookingFor: data.lookingFor || null,
      linkedinUrl: data.linkedinUrl || null,
      twitterUrl: data.twitterUrl || null,
      githubUrl: data.githubUrl || null,
      websiteUrl: data.websiteUrl || null,
      askMeAbout: data.askMeAbout || null,
    });

    revalidatePath("/directory");
    revalidatePath(`/${data.slug}`);

    return { success: true, data: { slug: data.slug } };
  } catch (error) {
    console.error("Failed to create profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

export async function updateProfile(
  data: ProfileFormValues & { photoUrl: string }
): Promise<ActionResult<{ slug: string }>> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Get current profile
  const currentProfile = await getCurrentUserProfile();
  if (!currentProfile) {
    return { success: false, error: "Profile not found" };
  }

  // Validate data
  const validationResult = profileFormSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message ?? "Invalid data",
    };
  }

  // Check slug availability (excluding current user)
  if (data.slug !== currentProfile.slug) {
    const slugAvailable = await checkSlugAvailability(data.slug, userId);
    if (!slugAvailable) {
      return { success: false, error: "This URL is already taken" };
    }
  }

  const oldSlug = currentProfile.slug;

  try {
    await db
      .update(profiles)
      .set({
        slug: data.slug,
        fullName: data.fullName,
        photoUrl: data.photoUrl,
        bio: data.bio,
        background: data.background,
        country: data.country,
        city: data.city,
        workingOn: data.workingOn || null,
        lookingFor: data.lookingFor || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        githubUrl: data.githubUrl || null,
        websiteUrl: data.websiteUrl || null,
        askMeAbout: data.askMeAbout || null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.clerkUserId, userId));

    revalidatePath("/directory");
    revalidatePath(`/${oldSlug}`);
    if (data.slug !== oldSlug) {
      revalidatePath(`/${data.slug}`);
    }

    return { success: true, data: { slug: data.slug } };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
