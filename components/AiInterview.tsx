"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";

import {cn} from "@/lib/utils";
import {vapi} from "@/lib/vapi";
import {interviewer} from "@/constants";
import {createFeedback} from "@/server/interviewService";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

interface AiInterviewProps {
    user: User;
    interview: Interview;
}

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const AiInterview = ({
                         user,
                   interview,
                     }: AiInterviewProps) => {
    const userId = user?.id
    const interviewId = interview?.id
    const questions = interview?.questions

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

    // Subscribe to VAPI event
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
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => {
            setIsAiSpeaking(true);
        };

        const onSpeechEnd = () => {
            setIsAiSpeaking(false);
        };

        const onError = (error: Error) => {
            // Ignore specific "meeting ended" errors
            if (error?.message?.includes("Meeting has ended")) return;
            console.error("Error:", error);
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

    // Generate feedback after finishing interview
    useEffect(() => {
        const handleGenerateFeedback = async (messages: SavedMessage[]) => {
            try {
                const result = await createFeedback({
                    interviewId: interviewId,
                    userId: userId,
                    transcript: messages,
                });

                if (result.success) {
                    router.push(`/${interviewId}/feedback`);
                } else {
                    console.error("Error creating feedback");
                    router.push("/");
                }
            } catch (error) {
                console.error("Error generating feedback:", error);
                toast.error("An error occurs when generating feedback");
            }
        };

        if (callStatus === CallStatus.FINISHED) {
            handleGenerateFeedback(messages);
        }
    }, [messages, callStatus, interviewId, router, userId]);

    // Auto scroll the chat history window
    useEffect(() => {
        if (messages.length > 0 && transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    const handleStartInterview = async () => {
        try {
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
        } catch (error) {
            console.error("Error starting interview:", error);
            toast.error("An error occurs when starting interview");
        }
    };

    const handleEndInterview = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    return (
        <>
            {/* Interview info */}
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
                        <h3 className="capitalize">{interview.companyName} & {interview.role} Interview</h3>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 items-center justify-between w-full">
                {/* AI interviewer card */}
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

                {/* User card */}
                <div
                    className="dark-gradient border-2 p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[400px] max-lg:hidden">
                    <div
                        className="flex flex-col gap-2 justify-center items-center p-7 rounded-2xl min-h-full">
                        <Image
                            src={user?.profilePic || "profile.svg"}
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3 className="text-center mt-5">{user?.name}</h3>
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

            {/* Action button */}
            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                    <Button className="relative btn-primary" onClick={() => handleStartInterview()}
                            disabled={callStatus === "FINISHED"}>
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== "CONNECTING" && "hidden"
                            )}
                        />

                        {(callStatus === "CONNECTING" || callStatus === "FINISHED") &&
                            <Loader2 className="animate-spin" size={20}/>}

                        <span className="relative">
                          {callStatus === "INACTIVE"
                              ? "Start"
                              : callStatus === "CONNECTING"
                                  ? "Connecting"
                                  : callStatus === "FINISHED"
                                      ? "Generating feedback"
                                      : ""}
                        </span>
                    </Button>
                ) : (
                    <Button className="btn-primary" variant="destructive" onClick={() => handleEndInterview()}>
                        End
                    </Button>
                )}
            </div>
        </>
    );
};

export default AiInterview;