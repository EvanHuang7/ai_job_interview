"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import {Button} from "./ui/button";
import {useState} from "react";
import {Laptop, Speech, SquareArrowOutUpRight, UserRound} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface FeedbackDetailProps {
    interview: Interview;
    allFeedbacks: Feedback[];
}

const FeedbackDetail = ({
                            interview, allFeedbacks,
                        }: FeedbackDetailProps) => {


    // default active feedback is set to newest feedbacks as active plan
    const activeFeedback = allFeedbacks[0];
    const [selectedFeedbackId, setSelectedFeedbackId] = useState<null | string>(activeFeedback.id);
    const currentFeedback = selectedFeedbackId
        ? allFeedbacks?.find((feedback) => feedback.id === selectedFeedbackId)
        : activeFeedback;

    return (
        <section className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7">
            {/* Interview Info */}
            <div className="flex flex-col gap-4">
                <h3 className="flex flex-row text-3xl font-semibold">
                    <Image
                        src={interview.companyLogo || "/company-logo.svg"}
                        alt="company-logo"
                        width={40}
                        height={40}
                        className="rounded-full object-fit size-[40px] mr-3"
                    />
                    <span className="capitalize">{interview.companyName}</span>
                </h3>
                <h3 className="flex flex-row text-3xl font-semibold">
                    <UserRound className="mr-3" size={40}/>
                    <span className="capitalize">{interview.role} ({interview.level} Level)</span>
                </h3>
                <h3 className="flex flex-row text-3xl font-semibold">
                    <Laptop className="mr-3" size={40}/>
                    <span className="capitalize">React, Express</span>
                </h3>
                <h3 className="flex flex-row text-3xl font-semibold">
                    <Speech className="mr-3" size={40}/>
                    <span
                        className="capitalize">{interview.type} Type Interviews ({interview.questions.length} questions) </span>
                </h3>
                {/* Interview Job Description Dialog */}
                <Dialog>
                    <h3 className="flex flex-row text-3xl font-semibold items-center">
                        <SquareArrowOutUpRight className="mr-3" size={40}/>
                        <DialogTrigger asChild>
                            <button className="text-blue-600 underline hover:text-blue-800 font-normal text-left">
                                Job Description
                            </button>
                        </DialogTrigger>
                    </h3>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Job Description</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="whitespace-pre-wrap text-left mt-4">
                            {interview.jobDescription}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </div>

            {/* All Feedback Buttons */}
            <div className="flex flex-wrap gap-2">
                {allFeedbacks.map((feedback) => (
                    <Button
                        key={feedback.id}
                        onClick={() => setSelectedFeedbackId(feedback.id)}
                        className={`text-foreground border hover:text-black min-w-[275px]  ${
                            selectedFeedbackId === feedback.id
                                ? "bg-primary/20 text-primary border-primary"
                                : "bg-transparent border-border"
                        }`}
                    >
                        {selectedFeedbackId === feedback.id && (
                            <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                            Selected
                        </span>
                        )}
                        {feedback.totalScore}/100 - {dayjs(feedback.createdAt).format("MMM D, h:mm A")}
                    </Button>
                ))}
            </div>

            <hr/>

            {/* Selected Feedback Details */}
            {currentFeedback && (
                <>
                    {/* Overall Score and Date */}
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star"/>
                        <p>
                            Overall Score:{" "}
                            <span className="font-bold">{currentFeedback.totalScore}</span>/100 - {" "}
                            {currentFeedback.createdAt
                                ? dayjs(currentFeedback.createdAt).format("YYYY, MMM D, h:mm A")
                                : "N/A"}
                        </p>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-4">
                        <h2>Feedback Summary:</h2>
                        <p>{currentFeedback.finalAssessment}</p>
                    </div>

                    {/* Interview Breakdown */}
                    <div className="flex flex-col gap-4">
                        <h2>Breakdown of the Feedback:</h2>
                        {currentFeedback.categoryScores?.map((category, index) => (
                            <div key={index}>
                                <p className="font-bold">
                                    {index + 1}. {category.name} ({category.score}/100)
                                </p>
                                <p>{category.comment}</p>
                            </div>
                        ))}
                    </div>

                    {/* Strengths */}
                    <div className="flex flex-col gap-3">
                        <h3>Strengths</h3>
                        <ul>
                            {currentFeedback.strengths?.map((strength, index) => (
                                <li key={index}>{strength}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="flex flex-col gap-3">
                        <h3>Areas for Improvement</h3>
                        <ul>
                            {currentFeedback.areasForImprovement?.map((area, index) => (
                                <li key={index}>{area}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Action Buttons */}
            <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center">
                <Button
                    className="text-foreground hover:text-black border bg-transparent rounded-full min-w-[165px] min-h-10 flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-center">Back to dashboard</p>
                    </Link>
                </Button>

                <Button
                    className="text-foreground hover:text-black border bg-transparent rounded-full min-w-[165px] min-h-10 flex-1">
                    <Link href={`/${interview.id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold  text-center">Retake Interview</p>
                    </Link>
                </Button>
            </div>
        </section>

    );
};

export default FeedbackDetail;
