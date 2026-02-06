"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Hand, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { claimProfile } from "@/actions/profile";

type ClaimButtonProps = {
  profileId: string;
  profileName: string;
};

export function ClaimButton({ profileId, profileName }: ClaimButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClaim = () => {
    setError(null);
    startTransition(async () => {
      const result = await claimProfile(profileId);

      if (result.success) {
        router.push(`/profile/edit`);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleClaim}
        disabled={isPending}
        size="sm"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Reclamando...
          </>
        ) : (
          <>
            <Hand className="mr-2 h-4 w-4" />
            Reclamar perfil
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
