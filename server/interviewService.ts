"use server";

import {generateObject, generateText} from "ai";
import {google} from "@ai-sdk/google";

import {feedbackSchema} from "@/constants";
import {db} from "@/lib/firebase/admin";
import {FieldValue} from "firebase-admin/firestore";
import {sanitizeText} from "@/lib/utils";
import cloudinary from "@/lib/cloudinary";

export async function generateInterview(params: generateInterviewParams) {
    const {userId, companyName, companyLogo, role, level, type, techstack, amount, jobDescription} = params;

    try {
        // Get user resume, sanitized resume and job description
        const userRecord = await db
            .collection("users")
            .doc(userId)
            .get();
        if (!userRecord.exists) return null;
        const userResume = userRecord.data()?.resume
        const cleanResume = sanitizeText(userResume);
        const cleanJobDescription = sanitizeText(jobDescription);

        // Build AI prompt
        const prompt = `Prepare questions for a job interview using candidate's resume, company job description and additional information below.
        Resume: ${cleanResume}
        Job description: ${cleanJobDescription}
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `

        // Get interview questions from AI
        const {text: questions} = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: prompt,
        });


        // Upload base64 companyLogo pic to cloudinary if there is one
        let uploadResult = {secure_url: ""}
        if (companyLogo) {
            uploadResult = await cloudinary.uploader.upload(companyLogo);
        }

        const interview = {
            userId: userId,
            companyName: companyName,
            companyLogo: uploadResult.secure_url,
            jobDescription: cleanJobDescription,
            role: role,
            level: level,
            type: type,
            techstack: techstack,
            questions: JSON.parse(questions),
            feedbacksNum: 0,
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        return {
            success: true,
            message: "Generate interview successfully",
        };
    } catch (error: any) {
        console.error("Error generating interview:", error);
        return {
            success: false,
            message: error.message || "Failed to generate interview",
        };
    }
}

export async function getInterviewsByUserId(
    userId: string
): Promise<Interview[] | null> {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db.collection("interviews").doc(id).get();

    return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const {interviewId, userId, transcript, feedbackId} = params;

    try {
        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`
            )
            .join("");

        const {object} = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const feedback = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };

        // Add new feedback to db
        await db.collection("feedback").add(feedback);

        // Increase interview feedbackNum by 1
        const interviewRef = db.collection("interviews").doc(interviewId);
        await interviewRef.update({
            feedbacksNum: FieldValue.increment(1),
        });

        return {success: true};
    } catch (error) {
        console.error("Error saving feedback:", error);
        return {success: false};
    }
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const {interviewId, userId} = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return {id: feedbackDoc.id, ...feedbackDoc.data()} as Feedback;
}

export async function getAllFeedbacksByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback[]> {
    const {interviewId, userId} = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    if (querySnapshot.empty) return [];

    return querySnapshot.docs.map(
        (doc) => ({id: doc.id, ...doc.data()} as Feedback)
    );
}


