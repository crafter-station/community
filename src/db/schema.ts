import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").unique(),
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
  codeId: integer("code_id"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  profile: one(profiles, {
    fields: [projects.profileId],
    references: [profiles.id],
  }),
}));

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
