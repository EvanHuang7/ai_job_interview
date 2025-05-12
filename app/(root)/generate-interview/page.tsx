import {getCurrentUser} from "@/server/authService";
import GenerateInterviewForm from "@/components/GenerateInterviewForm";
import React from "react";
import {redirect} from "next/navigation";
import {toast} from "sonner";

const Page = async () => {
    try {
        // Get user data
        const user = await getCurrentUser();
        // Redirect to sign-in page if user is not authenticated
        if (!user) {
            redirect("/sign-in");
        }

        return (
            <>
                <GenerateInterviewForm user={user}/>
            </>
        );
    } catch (error) {
        console.error("Error getting user:", error);
        toast.error("There is an error when getting data");
    }
};

export default Page;