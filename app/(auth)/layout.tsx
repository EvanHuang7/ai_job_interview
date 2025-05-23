import {ReactNode} from 'react'
import {redirect} from "next/navigation";

import {isAuthenticated} from "@/server/authService";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {House} from "lucide-react";

const AuthLayout = async ({children}: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) {
        // Redirect to home page if the user is authenticated
        redirect("/");
    }

    return (
        <>
            <div className="flex mx-auto max-w-7xl flex-col gap-12 mt-8 mb-12 px-16 max-sm:px-4">
                <div className="flex flex-row items-center justify-between gap-2 mt-2">
                    <nav>
                        <Link href="/" className="flex items-center gap-2 text-primary-100">
                            <House size={32}/>
                            <h2 className="max-md:hidden">AI Job Interview</h2>
                        </Link>
                    </nav>

                    <div className="flex flex-row items-center gap-2">
                        <Button
                            className="flx items-center gap-2 text-foreground hover:text-black border bg-transparent rounded-full">
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                        <Button
                            className="flx items-center gap-2 text-foreground hover:text-black border bg-transparent rounded-full">
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center max-sm:px-4 max-sm:py-8 mb-10">{children}</div>
        </>
    )
}
export default AuthLayout
