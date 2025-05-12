"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";

import {cn} from "@/lib/utils";
import {vapi} from "@/lib/vapi";
import {interviewer} from "@/constants";
import {createFeedback} from "@/server/interviewService";
import {Button} from "@/components/ui/button";

interface AgentProps {
    userName: string;
    userId?: string;
    profilePic: string;
    interviewId?: string;
    interview?: Interview;
    questions?: string[];
}

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({
                   userName,
                   userId,
                   profilePic,
                   interviewId,
                   interview,
                   questions,
               }: AgentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    // Group messages by consecutive same-role
    const groupedMessages = useMemo(() => {
        const groups: { role: string; content: string }[] = [];

        for (const msg of messages) {
            const last = groups[groups.length - 1];
            if (last && last.role === msg.role) {
                last.content += ` ${msg.content}`;
            } else {
                groups.push({role: msg.role, content: msg.content});
            }
        }

        return groups;
    }, [messages]);

    const router = useRouter();
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = {role: message.role, content: message.transcript};
                console.log("newMessage in onMessage()", newMessage)
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => {
            console.log("speech start");
            setIsAiSpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log("speech end");
            setIsAiSpeaking(false);
        };

        const onError = (error: Error) => {
            // Ignore specific "meeting ended" errors
            if (error?.message?.includes("Meeting has ended")) return;

            console.log("Error:", error);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            handleGenerateFeedback(messages);
        }
    }, [messages, callStatus, interviewId, router, userId]);

    useEffect(() => {
        if (messages.length > 0 && transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

            let formattedQuestions = "";
            if (questions) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join("\n");
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions,
                },
            });

    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log("handleGenerateFeedback");

        const result = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
        });

        if (result.success) {
            router.push(`/${interviewId}/feedback`);
        } else {
            console.log("Error creating feedback");
            router.push("/");
        }
    };

    return (
        <>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={interview.companyLogo || "/company-logo.svg"}
                            alt="cover-image"
                            width={40}
                            height={40}
                            className="rounded-full object-cover size-[40px]"
                        />
                        <h3 className="capitalize">{interview.role} Interview</h3>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 items-center justify-between w-full">
                {/* AI Interviewer Card */}
                <div
                    className="dark-gradient border-2 flex-center flex-col gap-2 p-7 rounded-lg flex-1 sm:basis-1/2 w-full h-[400px]">
                    <div
                        className="z-10 flex items-center justify-center rounded-full size-[120px] relative">
                        <Image
                            src="/ai-emily.jpg"
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        {isAiSpeaking && <span
                            className="absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75"/>}
                    </div>
                    <h3 className="text-center mt-5">Emily</h3>
                </div>

                {/* User Profile Card */}
                <div
                    className="dark-gradient border-2 p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-lg:hidden">
                    <div
                        className="flex flex-col gap-2 justify-center items-center p-7 rounded-2xl min-h-full">
                        <Image
                            src={profilePic || "profile.svg"}
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3 className="text-center mt-5">{userName}</h3>
                    </div>
                </div>

                {/* Transcript */}
                <div className="dark-gradient border-2 p-0.5 rounded-2xl w-full sm:w-1/3 h-[400px] flex flex-col">
                    <h3 className="text-center mt-2 pb-2 border-b-2">Chat history</h3>
                    <div className="flex-1 px-5 py-3 overflow-y-auto space-y-3">
                        {groupedMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "text-sm text-white px-3 py-2 rounded-xl max-w-[90%] whitespace-pre-wrap",
                                    msg.role === "user"
                                        ? "bg-primary-700 self-end text-right ml-auto"
                                        : "bg-muted text-left mr-auto"
                                )}
                            >
                                <strong className="block mb-1 capitalize text-xs opacity-80">{msg.role}:</strong>
                                {msg.content}
                            </div>
                        ))}
                        <div ref={transcriptEndRef}/>
                    </div>
                </div>

            </div>


            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                    <Button className="relative btn-primary" onClick={() => handleCall()}>
                <span
                    className={cn(
                        "absolute animate-ping rounded-full opacity-75",
                        callStatus !== "CONNECTING" && "hidden"
                    )}
                />

                        <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                  ? "Start"
                  : ". . ."}
            </span>
                    </Button>
                ) : (
                    <Button className="btn-primary" variant="destructive" onClick={() => handleDisconnect()}>
                        End
                    </Button>
                )}
            </div>
        </>
    );
};

export default Agent;