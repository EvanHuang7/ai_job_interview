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
    const feedback =
        userId && interviewId
            ? await getFeedbackByInterviewId({
                interviewId,
                userId,
            })
            : null;

    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    const badgeColor =
        {
            Behavioral: "bg-light-400",
            Mixed: "bg-light-600",
            Technical: "bg-light-800",
        }[normalizedType] || "bg-light-600";

    const formattedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now()
    ).format("MMM D, YYYY");

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-75">
            <div className="dark-gradient rounded-2xl  flex flex-col p-6 relative overflow-hidden gap-10">
                <div>
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

                        <div className="flex flex-row gap-2 items-center">
                            <Image src="/star.svg" width={22} height={22} alt="star"/>
                            <p>{feedback?.totalScore || "---"}/100</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between">
                    <p>{formattedDate}</p>

                    <Button className="btn-primary">
                        <Link
                            href={
                                feedback
                                    ? `/interview/${interviewId}/feedback`
                                    : `/interview/${interviewId}`
                            }
                        >
                            {feedback ? "Check Feedback" : "View Interview"}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;