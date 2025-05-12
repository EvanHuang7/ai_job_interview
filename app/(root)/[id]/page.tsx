import {redirect} from "next/navigation";

import Agent from "@/components/Agent";

import {getInterviewById,} from "@/server/interviewService";
import {getCurrentUser} from "@/server/authService";
import {toast} from "sonner";

const InterviewDetail = async ({params}: RouteParams) => {
    const {id} = await params;

    try {
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
                <Agent
                    userName={user?.name!}
                    userId={user?.id}
                    profilePic={user?.profilePic}
                    interviewId={id}
                    interview={interview}
                    questions={interview.questions}
                />
            </>
        );
    } catch (error) {
        console.error("Error getting user or fetching interview:", error);
        toast.error("There is an error when getting data");
    }
};

export default InterviewDetail;