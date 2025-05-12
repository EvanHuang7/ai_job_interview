import {redirect} from "next/navigation";

import {getAllFeedbacksByInterviewId, getInterviewById,} from "@/server/interviewService";
import {getCurrentUser} from "@/server/authService";
import FeedbackDetail from "@/components/FeedbackDetail";

const Feedback = async ({params}: RouteParams) => {
    const {id} = await params;
    const user = await getCurrentUser();

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const allFeedbacks = await getAllFeedbacksByInterviewId({
        interviewId: id,
        userId: user?.id!,
    });

    return (<FeedbackDetail
            id={id}
            interview={interview}
            allFeedbacks={allFeedbacks}
    />);
};

export default Feedback;