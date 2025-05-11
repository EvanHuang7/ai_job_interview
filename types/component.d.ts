interface AgentProps {
    userName: string;
    userId?: string;
    profilePic: string;
    interviewId?: string;
    feedbackId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

interface InterviewCardProps {
    interviewId?: string;
    userId?: string;
    companyName: string;
    companyLogo: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt?: string;
}
