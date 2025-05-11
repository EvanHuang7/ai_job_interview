type FormType = "sign-in" | "sign-up";

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

interface User {
    id: string;
    email: string;
    name: string;
    resume: string;
    profilePic: string;
}

interface Interview {
    id: string;
    companyName: string;
    companyLogo: string;
    role: string;
    level: string;
    questions: string[];
    techstack: string[];
    createdAt: string;
    userId: string;
    type: string;
    feedbacksNum: number;
}

interface Feedback {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
}