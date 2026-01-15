import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getCurrentUserProfile } from "@/actions/profile";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getCurrentUserProfile();

  if (profile) {
    redirect("/profile/edit");
  } else {
    redirect("/profile/new");
  }
}
