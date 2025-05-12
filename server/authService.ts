"use server";

import {auth, db} from "@/lib/firebase/admin";
import {cookies} from "next/headers";
import cloudinary from "@/lib/cloudinary";

const SESSION_AGE = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams): Promise<GeneralResponse> {
    const {uid, name, email} = params;

    try {
        // Check if user already exists
        const userRef = db.collection("users").doc(uid);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };
        }

        // Save new user to db
        await userRef.set({
            name,
            email,
            createdAt: new Date().toISOString(), // Optionally store account creation time
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Handle Firestore email already exists errors
        const isEmailError =
            error.code === "auth/email-already-exists" ||
            error.message?.includes("email-already-exists");

        return {
            success: false,
            message: isEmailError
                ? "This email is already in use"
                : "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams): Promise<GeneralResponse> {
    const {email, idToken} = params;

    try {
        // Check if user exists in firebase auth
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Please create an account first.",
            };

        // Set browser session cookie
        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Sign in user successfully.",
        };
    } catch (error: any) {
        console.error("Error sign in user:", error);
        return {
            success: false,
            message: "Failed to sign in account. Please try again.",
        };
    }
}

export async function signOut(): Promise<GeneralResponse> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("session");

        return {
            success: true,
            message: "Sign out user successfully.",
        };
    } catch (error: any) {
        console.error("Error sign out user:", error);
        return {
            success: false,
            message: "Failed to sign out user.",
        };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();

        const sessionCookie = cookieStore.get("session")?.value;
        if (!sessionCookie) return null;

        // Get the userId by checking session cookie in firebase auth
        const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);

        // Get user from db by userId
        const userRecord = await db
            .collection("users")
            .doc(decodedIdToken.uid)
            .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.error("Error get current user:", error);
        // Return null if error
        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        return !!user;
    } catch (error) {
        console.error("Error check if user authenticated:", error);
        // Return false if error
        return false;
    }
}

export async function updateProfile(params: UpdateProfileParams): Promise<GeneralResponse> {
    const {userId, name, resume, profilePic} = params;

    try {
        const userRef = db.collection("users").doc(userId);

        if (profilePic) {
            // Upload base64 profile pic to cloudinary
            const uploadResult = await cloudinary.uploader.upload(profilePic);

            await userRef.update({
                name: name,
                resume: resume,
                profilePic: uploadResult.secure_url
            });
        } else {
            await userRef.update({
                name: name,
                resume: resume,
            });
        }

        return {
            success: true,
            message: "User updated successfully",
        };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return {
            success: false,
            message: error.message || "Failed to update user",
        };
    }
}

export async function setSessionCookie(idToken: string): Promise<GeneralResponse> {
    try {
        const cookieStore = await cookies();

        // Create session cookie
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: SESSION_AGE * 1000, // milliseconds
        });

        // Set cookie in the browser
        cookieStore.set("session", sessionCookie, {
            maxAge: SESSION_AGE,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return {
            success: true,
            message: "Set session cookie successfully.",
        };
    } catch (error: any) {
        console.error("Error set session cookie:", error);
        return {
            success: false,
            message: "Failed to set session cookie",
        };
    }
}