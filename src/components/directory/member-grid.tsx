import { ProfileCard } from "@/components/profile/profile-card";
import type { Profile } from "@/db/schema";

type MemberGridProps = Readonly<{
  profiles: Profile[];
}>;

export function MemberGrid({ profiles }: MemberGridProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No members found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
