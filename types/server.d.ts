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

interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
}