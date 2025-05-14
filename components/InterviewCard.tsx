import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import {Button} from "./ui/button";
import {getAllFeedbacksByInterviewId} from "@/server/interviewService";
import {CircleCheck, Gem, Speech} from "lucide-react";

interface InterviewCardProps {
    userId: string;
    interview: Interview;
}

const InterviewCard = async ({
                                 userId,
                                 interview
                             }: InterviewCardProps) => {
    const interviewId = interview.id

    const feedbacks = userId && interviewId
        ? await getAllFeedbacksByInterviewId({interviewId, userId})
        : [];

    const isFeedbackAvailable = feedbacks?.length > 0;
    const highestFeedbackScore = feedbacks?.length > 0
        ? Math.max(...feedbacks.map(f => f.totalScore))
        : 0;
    const interviewDate = interview.createdAt || Date.now();

    const formattedDate = dayjs(interviewDate).format("YYYY, MMM D");
    const interviewUrl = isFeedbackAvailable
        ? `/${interviewId}/feedback`
        : `/${interviewId}`;
    const buttonLabel = isFeedbackAvailable ? "View Feedback" : "Start Interview";

    return (
        <div className="card-border max-sm:w-full w-[360px] min-h-50">
            <div className="dark-gradient rounded-2xl flex flex-col p-6 relative overflow-hidden gap-4">
                {/* Company Logo and name */}
                <h3 className="flex flex-row text-3xl font-semibold">
                    <Image
                        src={interview?.companyLogo || "/company-logo.svg"}
                        alt="company-logo"
                        width={40}
                        height={40}
                        className="rounded-full object-fit size-[40px] mr-3"
                    />
                    <span className="capitalize truncate">{interview.companyName}</span>
                </h3>

                {/* Role and level */}
                <h4 className="capitalize mt-3 truncate">{interview.role} ({interview.level} Level)</h4>

                {/* Question Number and Score */}
                <div className="flex flex-row justify-between gap-5 mt-3">
                    <div className="flex flex-row gap-2 items-center">
                        <Speech size={22}/>
                        <p className="capitalize">{interview.questions.length} questions</p>
                    </div>

                    {isFeedbackAvailable && (
                        <div className="flex flex-row gap-2 items-center">
                            {highestFeedbackScore >= 70 ? (
                                <Gem
                                    size={22}
                                    className={
                                        highestFeedbackScore >= 90
                                            ? "text-yellow-500"
                                            : highestFeedbackScore >= 80
                                                ? "text-gray-300"
                                                : "text-red-500"
                                    }
                                />
                            ) : (
                                <CircleCheck size={22}/>
                            )}
                            <p>{highestFeedbackScore}/100</p>
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
