import InterviewCard from "@/components/InterviewCard";

import {getCurrentUser} from "@/server/authService";
import {getInterviewsByUserId} from "@/server/interviewService";


async function Home() {
    const user = await getCurrentUser();

    const userInterviews = await getInterviewsByUserId(user?.id!);
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
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
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
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>There are no interviews available</p>
                    )}
                </div>
            </section>
        </>
    );
}

export default Home;