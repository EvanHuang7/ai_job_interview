import {getCurrentUser} from "@/server/authService";
import GenerateInterviewForm from "@/components/GenerateInterviewForm";
import React from "react";

const Page = async () => {
    const user = await getCurrentUser();

    return (
        <>
            <GenerateInterviewForm user={user}/>
        </>
    );
};

export default Page;