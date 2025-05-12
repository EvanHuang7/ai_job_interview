import Image from "next/image";
import {redirect} from "next/navigation";

import Agent from "@/components/Agent";

import {getInterviewById,} from "@/server/interviewService";
import {getCurrentUser} from "@/server/authService";

const InterviewDetails = async ({params}: RouteParams) => {
    const {id} = await params;

    const user = await getCurrentUser();

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    return (
        <>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={interview.companyLogo || "/company-logo.svg"}
                            alt="cover-image"
                            width={40}
                            height={40}
                            className="rounded-full object-cover size-[40px]"
                        />
                        <h3 className="capitalize">{interview.role} Interview</h3>
                    </div>
                </div>
            </div>

            <Agent
                userName={user?.name!}
                userId={user?.id}
                profilePic={user?.profilePic}
                interviewId={id}
                type="interview"
                questions={interview.questions}
            />
        </>
    );
};

export default InterviewDetails;