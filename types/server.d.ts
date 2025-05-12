interface SignUpParams {
    uid: string;
    name: string;
    email: string;
    password: string;
}

interface SignInParams {
    email: string;
    idToken: string;
}

interface UpdateProfileParams {
    userId: string;
    name: string;
    resume: string;
    profilePic: string;
}

interface generateInterviewParams {
    userId: string;
    companyName: string;
    companyLogo: string;
    role: string;
    level: string;
    type: string;
    techstack: string[];
    amount: number;
    jobDescription: string;
}

interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
}

interface GetAllFeedbacksByInterviewIdParams {
    interviewId: string;
    userId: string;
}