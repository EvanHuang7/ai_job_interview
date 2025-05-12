import React from 'react'
import {SquareArrowOutUpRight} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

interface JobDescriptionDialogProps {
    jobDescription: string;
}

const JobDescriptionDialog = ({
                                  jobDescription,
                              }: JobDescriptionDialogProps) => {
    return (
        <Dialog>
            <h3 className="flex flex-row text-3xl font-semibold items-center">
                <SquareArrowOutUpRight className="mr-3" size={40}/>
                <DialogTrigger asChild>
                    <button className="text-blue-600 underline hover:text-blue-800 font-normal text-left">
                        Job Description
                    </button>
                </DialogTrigger>
            </h3>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Job Description</DialogTitle>
                </DialogHeader>
                <DialogDescription className="whitespace-pre-wrap text-left mt-4">
                    {jobDescription}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
export default JobDescriptionDialog
