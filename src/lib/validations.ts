import { z } from "zod";

import { BIO_MAX_LENGTH, SLUG_MAX_LENGTH, SLUG_MIN_LENGTH } from "./constants";

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(SLUG_MIN_LENGTH, `Slug must be at least ${SLUG_MIN_LENGTH} characters`)
    .max(SLUG_MAX_LENGTH, `Slug must be less than ${SLUG_MAX_LENGTH} characters`)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(BIO_MAX_LENGTH, `Bio must be less than ${BIO_MAX_LENGTH} characters`),
  background: z
    .string()
    .min(2, "Background/role is required")
    .max(50, "Background must be less than 50 characters"),
  country: z
    .string()
    .min(2, "Country is required")
    .max(60, "Country must be less than 60 characters"),
  city: z
    .string()
    .min(2, "City is required")
    .max(60, "City must be less than 60 characters"),
  workingOn: z
    .string()
    .max(200, "Must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  lookingFor: z
    .string()
    .max(200, "Must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  askMeAbout: z
    .string()
    .max(150, "Must be less than 150 characters")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
