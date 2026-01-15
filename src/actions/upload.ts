"use server";

import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

import { createServiceClient } from "@/lib/supabase/server";

const BUCKET_NAME = "profile-photos";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (client compresses before upload)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

export async function uploadProfilePhoto(
  formData: FormData
): Promise<UploadResult> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "File too large. Maximum size is 10MB.",
    };
  }

  const supabase = createServiceClient();

  // Generate unique filename
  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${userId}/${nanoid()}.${extension}`;

  // Convert file to buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);

  return { success: true, url: publicUrl };
}

export async function deleteProfilePhoto(url: string): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const supabase = createServiceClient();

  // Extract path from URL
  const urlParts = url.split(`${BUCKET_NAME}/`);
  if (urlParts.length < 2) {
    return;
  }

  const path = urlParts[1];

  // Only allow deleting own photos
  if (!path.startsWith(userId)) {
    return;
  }

  await supabase.storage.from(BUCKET_NAME).remove([path]);
}
