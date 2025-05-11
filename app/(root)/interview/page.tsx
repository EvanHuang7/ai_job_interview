import Agent from "@/components/Agent";
import {getCurrentUser} from "@/server/authService";

// TODO: clean up this page and component
const Page = async () => {
    const user = await getCurrentUser();

    return (
        <>
            <h3>Interview Generation</h3>

            <Agent
                userName={user?.name!}
                userId={user?.id}
                profilePic={user?.profilePic}
                type="generate"
            />
        </>
    );
};

export default Page;