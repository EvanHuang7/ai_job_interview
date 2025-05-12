import {redirect} from "next/navigation";

import {getAllFeedbacksByInterviewId, getInterviewById,} from "@/server/interviewService";
import {getCurrentUser} from "@/server/authService";
import FeedbackDetail from "@/components/FeedbackDetail";
import {toast} from "sonner";

const Feedback = async ({params}: RouteParams) => {
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

        // Fetch all feedbacks for the interview
        const allFeedbacks = await getAllFeedbacksByInterviewId({
            interviewId: id,
            userId: user.id,
        });

        return (
            <FeedbackDetail
                id={id}
                interview={interview}
                allFeedbacks={allFeedbacks}
            />
        );
    } catch (error) {
        console.error("Error getting user or fetching interview or all feedbacks:", error);
        toast.error("There is an error when getting data");
    }
};

export default Feedback;