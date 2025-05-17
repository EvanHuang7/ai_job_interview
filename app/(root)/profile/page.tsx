import React from "react";
import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/server/authService";
import { redirect } from "next/navigation";

const Page = async () => {
  // Get user data
  const user = await getCurrentUser();
  // Redirect to sign-in page if user is not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  return <ProfileForm user={user} />;
};
export default Page;
