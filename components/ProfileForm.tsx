"use client"

import React, {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {z} from "zod"
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormItem, FormMessage} from "@/components/ui/form"
import {toast} from "sonner";
import FormField from "./FormField";

import {updateProfile} from "@/server/authService";
import {Camera} from "lucide-react";
import {cn} from "@/lib/utils";

interface ProfileFormProps {
    user: User;
}

const profileFormSchema = () => {
    return z.object({
        email: z.string(),
        name: z.string()
            .min(3, "Name must be at least 3 characters")
            .max(30, "Name must be less than 50 characters"),
        resume: z.string(),
    });
};

const ProfileForm = ({
                         user,
                     }: ProfileFormProps) => {

    const [selectedImg, setSelectedImg] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    const router = useRouter();

    const formSchema = profileFormSchema();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user.email,
            name: user.name,
            resume: user.resume,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const {email, name, resume} = data;

            const result = await updateProfile({
                userId: user.id,
                name: name,
                resume: resume,
                profilePic: selectedImg,
            });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Updated profile successfully");
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
            setSelectedImg(base64Image);
        };
    };

    return (
        <div className="flex items-center justify-center max-sm:px-4 max-sm:py-8 mb-10">
            <div className="card-border sm:min-w-[400px] md:min-w-[566px] mt-10">
                <div className="flex flex-col gap-6 py-14 px-10 dark-gradient rounded-2xl">
                    <div className="flex flex-col text-center text-primary-100">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    <Form {...form}>
                        <form noValidate onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            const firstError = Object.values(errors)[0];
                            if (firstError && firstError.message) {
                                toast.error(firstError.message.toString());
                            }
                        })} className="w-full space-y-6 mt-4 form">
                            {/* Avatar Upload Field */}
                            <Controller
                                control={form.control}
                                name="profilePic"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={selectedImg || user.profilePic || "/profile.svg"}
                                                        alt="Profile"
                                                        className="size-32 rounded-full object-cover border-4"
                                                    />
                                                    <label
                                                        htmlFor="avatar-upload"
                                                        className={cn(
                                                            "absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200",
                                                            isUpdatingProfile && "animate-pulse pointer-events-none"
                                                        )}
                                                    >
                                                        <Camera className="w-5 h-5 text-base-200"/>
                                                        <input
                                                            type="file"
                                                            id="avatar-upload"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            disabled={isUpdatingProfile}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-sm text-zinc-400">
                                                    {isUpdatingProfile
                                                        ? "Uploading..."
                                                        : "Click the camera icon to update your photo"}
                                                </p>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Your email address"
                                type="email"
                                disable={true}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                                type="text"
                            />

                            <FormField
                                control={form.control}
                                name="resume"
                                label="Resume"
                                placeholder="Your Resume"
                                type="textarea"
                            />

                            <Button className="!w-full !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
                                    type="submit">
                                Update Profile
                            </Button>
                        </form>
                    </Form>

                </div>
            </div>
        </div>
    )
}
export default ProfileForm
