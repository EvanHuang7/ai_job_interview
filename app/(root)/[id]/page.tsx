import { redirect } from "next/navigation";

import { getInterviewById } from "@/server/interviewService";
import { getCurrentUser } from "@/server/authService";
import AiInterview from "@/components/AiInterview";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;

  // Get user data
  const user = await getCurrentUser();
  // Redirect to sign-in page if user is not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch interview data
  const interview = await getInterviewById(id);
  // Redirect to home if interview not found
  if (!interview) {
    redirect("/");
  }

  return (
    <>
      <AiInterview user={user} interview={interview} />
    </>
  );
};

export default Page;
