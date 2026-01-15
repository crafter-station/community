import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/db/schema";

type ProfileCardProps = Readonly<{
  profile: Profile;
}>;

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link
      href={`/${profile.slug}`}
      className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src={profile.photoUrl}
            alt={profile.fullName}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
            {profile.fullName}
          </h3>

          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {profile.bio}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {profile.background}
            </Badge>

            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {profile.city}, {profile.country}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
