import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import {Button} from "./ui/button";
import {getAllFeedbacksByInterviewId} from "@/server/interviewService";

interface InterviewCardProps {
    userId: string;
    interview: Interview;
}

const InterviewCard = async ({
                                 userId,
                                 interview
                             }: InterviewCardProps) => {
    const interviewId = interview.id
    const companyName = interview?.companyName || ""
    const companyLogo = interview?.companyLogo || ""
    const role = interview.role
    const createdAt = interview.createdAt

    const feedbacks = userId && interviewId
        ? await getAllFeedbacksByInterviewId({interviewId, userId})
        : [];

    const isFeedbackAvailable = feedbacks?.length > 0;
    const interviewDate = feedbacks?.[0]?.createdAt || createdAt || Date.now();

    const formattedDate = dayjs(interviewDate).format("YYYY, MMM D");
    const interviewUrl = isFeedbackAvailable
        ? `/${interviewId}/feedback`
        : `/${interviewId}`;
    const buttonLabel = isFeedbackAvailable ? "Check Feedback" : "View Interview";

    return (
        <div className="card-border max-sm:w-full w-[360px] min-h-75">
            <div className="dark-gradient rounded-2xl flex flex-col p-6 relative overflow-hidden gap-4">
                {/* Company Logo */}
                <Image
                    src={companyLogo || "/company-logo.svg"}
                    alt="cover-image"
                    width={90}
                    height={90}
                    className="rounded-full object-fit size-[90px]"
                />

                {/* Company name */}
                <h3 className="mt-3 capitalize">{companyName}</h3>

                {/* Role and Score */}
                <div className="flex flex-row justify-between gap-5 mt-3">
                    <h4 className="capitalize">{role}</h4>

                    {isFeedbackAvailable && (
                        <div className="flex flex-row gap-2 items-center">
                            <Image src="/star.svg" width={22} height={22} alt="star"/>
                            <p>{feedbacks?.[0]?.totalScore}/100</p>
                        </div>
                    )}
                </div>

                {/* Date and button */}
                <div className="flex flex-row justify-between">
                    <p className="mt-2">{formattedDate}</p>

                    <Button className="btn-primary">
                        <Link href={interviewUrl}>{buttonLabel}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
