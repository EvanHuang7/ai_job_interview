import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import {Button} from "./ui/button";
import {getRandomInterviewCover} from "@/lib/utils";
import {getFeedbackByInterviewId} from "@/server/interviewService";

const InterviewCard = async ({
                                 interviewId,
                                 userId,
                                 role,
                                 type,
                                 techstack,
                                 createdAt,
                             }: InterviewCardProps) => {
    const feedback = userId && interviewId
        ? await getFeedbackByInterviewId({interviewId, userId})
        : null;

    const isFeedbackAvailable = Boolean(feedback);
    const interviewDate = feedback?.createdAt || createdAt || Date.now();

    const formattedDate = dayjs(interviewDate).format("YYYY, MMM D");
    const interviewUrl = isFeedbackAvailable
        ? `/interview/${interviewId}/feedback`
        : `/interview/${interviewId}`;
    const buttonLabel = isFeedbackAvailable ? "Check Feedback" : "View Interview";

    return (
        <div className="card-border max-sm:w-full w-[360px] min-h-75">
            <div className="dark-gradient rounded-2xl flex flex-col p-6 relative overflow-hidden gap-4">
                    {/* Company Image */}
                    <Image
                        src={getRandomInterviewCover()}
                        alt="cover-image"
                        width={90}
                        height={90}
                        className="rounded-full object-fit size-[90px]"
                    />

                    {/* Company name */}
                    <h3 className="mt-3 capitalize">Google xxxxxxx xxxxx</h3>

                    {/* Role and Score */}
                    <div className="flex flex-row justify-between gap-5 mt-3">
                        <h3 className="capitalize">{role}</h3>

                        {isFeedbackAvailable && (
                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/star.svg" width={22} height={22} alt="star"/>
                                <p>{feedback.totalScore}/100</p>
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
