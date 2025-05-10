"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import {Button} from "./ui/button";
import {useState} from "react";

interface FeedbackDetailProps {
    id: string;
    interview: Interview;
    allFeedbacks: Feedback[];
}

const FeedbackDetail = ({
                            id, interview, allFeedbacks,
                        }: FeedbackDetailProps) => {


    // default active feedback is set to newest feedbacks as active plan
    const activeFeedback = allFeedbacks[0];
    const [selectedFeedbackId, setSelectedFeedbackId] = useState<null | string>(null);
    const currentFeedback = selectedFeedbackId
        ? allFeedbacks?.find((feedback) => feedback.id === selectedFeedbackId)
        : activeFeedback;

    return (
        <section className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7">
            <div className="flex flex-col gap-4">
                <h3 className="text-4xl font-semibold">
                    Company :{" "}
                    <span className="capitalize">Google</span>
                </h3>
                <h3 className="text-4xl font-semibold">
                    Role :{" "}
                    <span className="capitalize">{interview.role}</span>
                </h3>
                <h3 className="text-4xl font-semibold">
                    Technology Stack :{" "}
                    <span className="capitalize">React, Express</span>
                </h3>
                <h3 className="text-4xl font-semibold">
                    Interview type :{" "}
                    <span className="capitalize">{interview.type}</span>
                </h3>
            </div>

            {/* Feedback Buttons */}
            <div className="flex flex-wrap gap-2">
                {allFeedbacks.map((feedback) => (
                    <Button
                        key={feedback.id}
                        onClick={() => setSelectedFeedbackId(feedback.id)}
                        className={`text-foreground border hover:text-white ${
                            selectedFeedbackId === feedback.id
                                ? "bg-primary/20 text-primary border-primary"
                                : "bg-transparent border-border hover:border-primary/50"
                        }`}
                    >
                        {selectedFeedbackId === feedback.id && (
                            <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                            ACTIVE
                        </span>
                        )}
                        Feedback {feedback.id}
                    </Button>
                ))}
            </div>

            <hr/>

            {/* Feedback Details */}
            {currentFeedback && (
                <>
                    {/* Overall Score and Date */}
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star"/>
                        <p>
                            Overall Score:{" "}
                            <span className="font-bold">{currentFeedback.totalScore}</span>/100 - (Finished at{" "}
                            {currentFeedback.createdAt
                                ? dayjs(currentFeedback.createdAt).format("YYYY, MMM D, h:mm A")
                                : "N/A"})
                        </p>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-4">
                        <h2>Summary:</h2>
                        <p>{currentFeedback.finalAssessment}</p>
                    </div>

                    {/* Interview Breakdown */}
                    <div className="flex flex-col gap-4">
                        <h2>Breakdown of the Interview:</h2>
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
                <Button className="btn-primary flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-center">Back to dashboard</p>
                    </Link>
                </Button>

                <Button className="btn-primary flex-1">
                    <Link href={`/interview/${id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-black text-center">Retake Interview</p>
                    </Link>
                </Button>
            </div>
        </section>

    );
};

export default FeedbackDetail;
