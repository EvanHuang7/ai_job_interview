import React from 'react'
import ProfileForm from "@/components/ProfileForm";
import {getCurrentUser} from "@/server/authService";

const Page = async () => {
    const user = await getCurrentUser();

    return (
        <ProfileForm user={user}/>
    )
}
export default Page
