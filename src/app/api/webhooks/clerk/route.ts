import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify the webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === "user.updated") {
    const { id, first_name, last_name, image_url } = evt.data;

    // Build the full name
    const fullName = [first_name, last_name].filter(Boolean).join(" ").trim();

    if (!fullName && !image_url) {
      return new Response("No relevant data to update", { status: 200 });
    }

    try {
      // Check if user has a profile
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.clerkUserId, id),
      });

      if (existingProfile) {
        // Only update if values actually changed
        const updates: Partial<{
          fullName: string;
          photoUrl: string;
          updatedAt: Date;
        }> = {};

        if (fullName && fullName !== existingProfile.fullName) {
          updates.fullName = fullName;
        }

        if (image_url && image_url !== existingProfile.photoUrl) {
          updates.photoUrl = image_url;
        }

        if (Object.keys(updates).length > 0) {
          updates.updatedAt = new Date();
          await db
            .update(profiles)
            .set(updates)
            .where(eq(profiles.clerkUserId, id));

          console.log(`Updated profile for user ${id}:`, updates);
        }
      }
    } catch (error) {
      console.error("Failed to update profile from webhook:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
