import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getCurrentUserProfile } from "@/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { Header } from "@/components/layout/header";

export const metadata = {
  title: "Edit Profile | Crafter Station Directory",
  description: "Update your Crafter Station profile",
};

export default async function EditProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/profile/new");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Edit Your Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Update your information to keep your profile fresh.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <ProfileForm mode="edit" initialData={profile} />
        </div>
      </main>
    </>
  );
}
