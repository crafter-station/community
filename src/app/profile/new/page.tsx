import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getCurrentUserProfile } from "@/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { Header } from "@/components/layout/header";

export const metadata = {
  title: "Create Profile | Crafter Station Directory",
  description: "Create your profile and join the Crafter Station community",
};

export default async function NewProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a profile
  const existingProfile = await getCurrentUserProfile();
  if (existingProfile) {
    redirect("/profile/edit");
  }

  // Get Clerk user data to prefill form
  const user = await currentUser();

  const prefillData = {
    fullName: user?.fullName ?? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
    photoUrl: user?.imageUrl ?? "",
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Join the Crafter Station directory and connect with other builders.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <ProfileForm mode="create" prefill={prefillData} />
        </div>
      </main>
    </>
  );
}
