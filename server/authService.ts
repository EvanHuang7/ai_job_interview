"use server";

import {auth, db} from "@/lib/firebase/admin";
import {cookies} from "next/headers";
import cloudinary from "@/lib/cloudinary";

const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const {uid, name, email} = params;

    try {
        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // save user to db
        await db.collection("users").doc(uid).set({
            name,
            email,
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };

        await setSessionCookie(idToken);
    } catch (error: any) {
        console.error("Error sign in user:", error);

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

export async function signOut() {
    const cookieStore = await cookies();

    cookieStore.delete("session");
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // get user info from db
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log(error);

        // Invalid or expired session
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function updateProfile(params: UpdateProfileParams) {
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

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}