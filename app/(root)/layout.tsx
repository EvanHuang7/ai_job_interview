import {ReactNode} from 'react'
import Link from "next/link";
import Image from "next/image";
import {redirect} from "next/navigation";

import {isAuthenticated, signOut} from "@/server/authService";
import {Button} from "@/components/ui/button";

const RootLayout = async ({children}: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/sign-in");

    return (
        <div className="root-layout">
            <div className="flex flex-row items-center justify-between gap-2 mt-2">
                <nav>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32}/>
                        <h2 className="max-md:hidden">AI Job Interview</h2>
                    </Link>
                </nav>

                <div className="flex flex-row items-center gap-2">
                    <Button className="flx items-center gap-2 btn-primary" variant="outline">
                        <Link href="/interview">Generate Interview</Link>
                    </Button>
                    <Button className="flx items-center gap-2 btn-primary" variant="outline">
                        <Link href="/interview">Setting</Link>
                    </Button>
                    <Button className="flx items-center gap-2 btn-primary" variant="outline" onClick={signOut}>
                        <Link href="/sign-in">Logout</Link>
                    </Button>
                </div>
            </div>


            {children}
        </div>
    );
}
export default RootLayout
