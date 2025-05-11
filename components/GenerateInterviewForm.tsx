"use client"

import React, {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormItem, FormMessage} from "@/components/ui/form"
import {toast} from "sonner";
import FormField from "./FormField";

import {Camera} from "lucide-react";
import {generateInterview} from "@/server/interviewService";
import SelectField from "@/components/SelectField";
import {useRouter} from "next/navigation";

interface GenerateInterviewFormProps {
    user: User;
}

const generateInterviewFormSchema = () => {
    return z.object({
        companyName: z.string().min(2, "Company name must be at least 2 characters")
            .max(30, "Company name must be less than 30 characters"),
        role: z.string()
            .min(2, "Job role must be at least 2 characters")
            .max(30, "Job role must be less than 30 characters"),
        level: z.string().nonempty("Experience level is required"),
        type: z.string().nonempty("Interview type is required"),
        amount: z.number().min(1, "At least 1 interview question required")
            .max(20, "At most 20 interview questions"),
        techstack: z.string().optional(),
        jobDescription: z.string().optional(),
    });
};

const GenerateInterviewForm = ({
                                   user,
                               }: GenerateInterviewFormProps) => {
    const router = useRouter();

    const [selectedCompanyLogo, setSelectedCompanyLogo] = useState("");
    const formSchema = generateInterviewFormSchema();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            role: "",
            level: "intern",
            type: "behavioral",
            amount: 1,
            techstack: "",
            jobDescription: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const {companyName, role, level, type, techstack, amount, jobDescription,} = data;

            const result = await generateInterview({
                userId: user.id,
                companyName: companyName,
                companyLogo: selectedCompanyLogo,
                role: role,
                level: level,
                type: type,
                techstack: techstack ? techstack.split(",") : [],
                amount: amount,
                jobDescription: jobDescription || "",
            });

            if (!result?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success("Generate interview successfully");
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error.message || "Unknown error"}`);
        }
    };

    const handleImageUpload = async (event) => {
        // Get image file of user selected and check it
        const file = event.target.files[0];
        if (!file) {
            console.log("Function errored because of no file uploaded");
            toast.error("Sorry, no file uploaded");
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return toast.error(
                "Please try to upload a file less than max file size 2MB"
            );
        }

        // Convert the image to base64 format
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            // Set the user selected image to the avator UI
            setSelectedCompanyLogo(base64Image);
        };
    };

    return (
        <div className="flex items-center justify-center max-sm:px-4 max-sm:py-8 mb-10">
            <div className="card-border sm:min-w-[400px] md:min-w-[566px] mt-10">
                <div className="flex flex-col gap-6 py-14 px-10 dark-gradient rounded-2xl">
                    <div className="flex flex-col text-center text-primary-100">
                        <h1 className="text-2xl font-semibold ">Generate an interview</h1>
                    </div>
                    <Form {...form}>
                        <form noValidate onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            const firstError = Object.values(errors)[0];
                            if (firstError && firstError.message) {
                                toast.error(firstError.message.toString());
                            }
                        })} className="w-full space-y-6 mt-4 form">
                            {/* Company Logo Upload Field */}
                            <Controller
                                control={form.control}
                                name="companyLogo"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={selectedCompanyLogo || "/profile.svg"}
                                                        alt="Profile"
                                                        className="size-32 rounded-full object-cover border-4"
                                                    />
                                                    <label
                                                        htmlFor="avatar-upload"
                                                        className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                                                    >
                                                        <Camera className="w-5 h-5 text-base-200"/>
                                                        <input
                                                            type="file"
                                                            id="avatar-upload"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-sm text-zinc-400">
                                                    Click the camera icon to add company logo
                                                </p>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="companyName"
                                label="Company name"
                                placeholder="Enter a company name"
                                type="text"
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                label="Job role"
                                placeholder="Enter a job role"
                                type="text"
                            />

                            <SelectField
                                control={form.control}
                                name="level"
                                label="Experience level"
                                placeholder="Choose level"
                                options={[
                                    {value: "intern", label: "Intern"},
                                    {value: "junior", label: "Junior"},
                                    {value: "intermediate", label: "Intermediate"},
                                    {value: "senior", label: "Senior"},
                                    {value: "lead", label: "Lead"},
                                ]}
                            />

                            <SelectField
                                control={form.control}
                                name="type"
                                label="Interview type"
                                placeholder="Choose type"
                                options={[
                                    {value: "behavioral", label: "Behavioral-type"},
                                    {value: "technical", label: "Technical-type"},
                                    {value: "all", label: "All-type"},
                                ]}
                            />

                            <FormField
                                control={form.control}
                                name="techstack"
                                label="Tech stack"
                                placeholder="Python, React (use comma to seprate each tech stack)"
                                type="text"
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                label="Question amount"
                                placeholder="Enter a number between 1 and 20"
                                type="number"
                            />

                            <FormField
                                control={form.control}
                                name="jobDescription"
                                label="Job description"
                                placeholder="Add job description here"
                                type="textarea"
                            />

                            <Button className="!w-full !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
                                    type="submit">
                                Generate Interview
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default GenerateInterviewForm
