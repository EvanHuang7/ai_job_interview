import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/server/authService";
import { getInterviewsByUserId } from "@/server/interviewService";
import { redirect } from "next/navigation";

async function Home() {
  // Get user data
  const user = await getCurrentUser();
  // Redirect to sign-in page if user is not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch interviews data
  const userInterviews = await getInterviewsByUserId(user.id);

  // Get new and finished interviews based on feedbacksNum
  const newInterviews = userInterviews?.filter(
    (interview) => interview.feedbacksNum === 0
  );
  const finishedFeedback = userInterviews?.filter(
    (interview) => interview.feedbacksNum >= 1
  );

  const hasNewInterviews = newInterviews?.length! > 0;
  const hasFinishedInterviews = finishedFeedback?.length! > 0;

  return (
    <>
      <section className="flex flex-col gap-6 mt-8">
        <h2>New Interviews</h2>

        <div className="flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch">
          {hasNewInterviews ? (
            newInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interview={interview}
              />
            ))
          ) : (
            <p>You haven&apos;t generate any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Finished Interviews</h2>

        <div className="flex flex-wrap gap-4 max-lg:flex-col w-full items-stretch">
          {hasFinishedInterviews ? (
            finishedFeedback?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interview={interview}
              />
            ))
          ) : (
            <p>There are no finished interviews yet</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
