import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Pencil } from "lucide-react";

import { Header } from "@/components/layout/header";
import { ProfileDetail } from "@/components/profile/profile-detail";
import { Button } from "@/components/ui/button";
import { getProfileBySlug } from "@/actions/profile";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Profile Not Found | Crafter Station",
    };
  }

  const title = `${profile.fullName} | Crafter Station`;
  const description = profile.bio;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: profile.photoUrl,
          width: 400,
          height: 400,
          alt: profile.fullName,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [profile.photoUrl],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const { userId } = await auth();
  const isOwner = userId === profile.clerkUserId;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/directory">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>

          {isOwner && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/edit">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>

        <ProfileDetail profile={profile} />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </main>
    </>
  );
}
