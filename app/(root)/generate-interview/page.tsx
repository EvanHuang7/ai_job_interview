import { getCurrentUser } from "@/server/authService";
import GenerateInterviewForm from "@/components/GenerateInterviewForm";
import React from "react";
import { redirect } from "next/navigation";

const Page = async () => {
  // Get user data
  const user = await getCurrentUser();
  // Redirect to sign-in page if user is not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <GenerateInterviewForm user={user} />
    </>
  );
};

export default Page;
