import React from 'react'
import ProfileForm from "@/components/ProfileForm";
import {getCurrentUser} from "@/server/authService";
import {toast} from "sonner";
import {redirect} from "next/navigation";

const Page = async () => {
    try {
        // Get user data
        const user = await getCurrentUser();
        // Redirect to sign-in page if user is not authenticated
        if (!user) {
            redirect("/sign-in");
        }

        return (
            <ProfileForm user={user}/>
        )

    } catch (error) {
        console.error("Error getting user:", error);
        toast.error("There is an error when getting data");
    }
}
export default Page
