import type { MetadataRoute } from "next";

import { getPublishedProfiles } from "@/actions/directory";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await getPublishedProfiles();

  const profileUrls = profiles.map((profile) => ({
    url: `https://crafterstation.com/${profile.slug}`,
    lastModified: profile.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://crafterstation.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://crafterstation.com/directory",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...profileUrls,
  ];
}
