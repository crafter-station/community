import Image from "next/image";
import { MapPin, Briefcase, Target, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SocialLinks } from "@/components/shared/social-links";
import { isLocalImageUrl } from "@/lib/utils";
import type { Profile } from "@/db/schema";

type ProfileDetailProps = Readonly<{
  profile: Profile;
}>;

export function ProfileDetail({ profile }: ProfileDetailProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-border">
            <Image
              src={profile.photoUrl}
              alt={profile.fullName}
              fill
              className="object-cover"
              priority
              unoptimized={isLocalImageUrl(profile.photoUrl)}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="mt-1 text-lg text-muted-foreground">{profile.bio}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Badge variant="default" className="font-mono">
                {profile.background}
              </Badge>

              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {profile.city}, {profile.country}
              </span>
            </div>

            <div className="mt-4">
              <SocialLinks
                linkedinUrl={profile.linkedinUrl}
                twitterUrl={profile.twitterUrl}
                githubUrl={profile.githubUrl}
                websiteUrl={profile.websiteUrl}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      {(profile.workingOn || profile.lookingFor || profile.askMeAbout) && (
        <>
          <Separator />
          <div className="space-y-4 p-6">
            {profile.workingOn && (
              <div className="flex gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">Working on</h3>
                  <p className="mt-1 text-muted-foreground">
                    {profile.workingOn}
                  </p>
                </div>
              </div>
            )}

            {profile.lookingFor && (
              <div className="flex gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">Looking for</h3>
                  <p className="mt-1 text-muted-foreground">
                    {profile.lookingFor}
                  </p>
                </div>
              </div>
            )}

            {profile.askMeAbout && (
              <div className="flex gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">Ask me about</h3>
                  <p className="mt-1 text-muted-foreground">
                    {profile.askMeAbout}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
