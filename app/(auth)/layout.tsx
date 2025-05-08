import {ReactNode} from 'react'
import {redirect} from "next/navigation";

import {isAuthenticated} from "@/server/authService";

const AuthLayout = async ({children}: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) redirect("/");

    return (
        <div className="auth-layout">{children}</div>
    )
}
export default AuthLayout
