import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  slug: text("slug").notNull().unique(),
  
  // Required fields
  fullName: text("full_name").notNull(),
  photoUrl: text("photo_url").notNull(),
  bio: text("bio").notNull(), // max 120 chars, enforced at app level
  background: text("background").notNull(), // free text for role/background
  country: text("country").notNull(),
  city: text("city").notNull(),
  
  // Optional fields
  workingOn: text("working_on"),
  lookingFor: text("looking_for"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  websiteUrl: text("website_url"),
  askMeAbout: text("ask_me_about"),
  
  // Metadata
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
