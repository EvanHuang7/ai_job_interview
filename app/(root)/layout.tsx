import {ReactNode} from 'react'
import Link from "next/link";
import {redirect} from "next/navigation";

import {isAuthenticated, signOut} from "@/server/authService";
import {Button} from "@/components/ui/button";
import {House, LogOut, SquarePen, UserRoundPen} from "lucide-react";

const RootLayout = async ({children}: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
        // Redirect to login page if the user is not authenticated
        redirect("/sign-in");
    }

    return (
        <div className="flex mx-auto max-w-7xl flex-col gap-12 my-8 px-16 max-sm:px-4">
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
                        <SquarePen/>
                        <Link href="/generate-interview">Generate Interview</Link>
                    </Button>
                    <Button
                        className="flx items-center gap-2 text-foreground hover:text-black border bg-transparent rounded-full">
                        <UserRoundPen/>
                        <Link href="/profile">Profile</Link>
                    </Button>
                    <Button
                        className="flx items-center gap-2 text-foreground hover:text-black border bg-transparent rounded-full"
                        onClick={signOut}>
                        <LogOut/>
                        <Link href="/sign-in">Logout</Link>
                    </Button>
                </div>
            </div>


            {children}
        </div>
    );
}
export default RootLayout
