import { redirect } from "next/navigation";

import {
  getAllFeedbacksByInterviewId,
  getInterviewById,
} from "@/server/interviewService";
import { getCurrentUser } from "@/server/authService";
import FeedbackDetail from "@/components/FeedbackDetail";

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

  // Fetch all feedbacks for the interview
  const allFeedbacks = await getAllFeedbacksByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return <FeedbackDetail interview={interview} allFeedbacks={allFeedbacks} />;
};

export default Page;
