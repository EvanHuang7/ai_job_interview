"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {toast} from "sonner";
import FormField from "./FormField";

import {auth} from "@/lib/firebase/client";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword,} from "firebase/auth";

import {signIn, signUp} from "@/server/authService";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up"
            ? z.string()
                .min(3, "Name must be at least 3 characters")
                .max(30, "Name must be less than 50 characters")
            : z.string().optional(),
        email: z.string()
            .min(1, "Email is required")
            .email("Enter a valid email"),
        password: z.string()
            .min(6, "Password must be at least 6 characters")
            .max(20, "Password is too long"),
    });
};

const AuthForm = ({type}: { type: FormType }) => {
    const router = useRouter();
    // 1. Define your form.
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (type === "sign-up") {
                const {name, email, password} = data;

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const result = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email,
                    password,
                });

                if (!result.success) {
                    toast.error(result.message);
                    return;
                }

                toast.success("Signed up successfully. Please sign in.");
                router.push("/sign-in");
            } else {
                const {email, password} = data;

                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const idToken = await userCredential.user.getIdToken();
                if (!idToken) {
                    toast.error("Sign in Failed. Please try again.");
                    return;
                }

                await signIn({
                    email,
                    idToken,
                });

                toast.success(`Signed in successful!`);
                router.push("/");
            }
        } catch (error) {
            console.log(error);

            if (error.code === "auth/email-already-in-use") {
                toast.error("This email is already in use.");
                return;
            }

            if (error.code === "auth/invalid-credential") {
                toast.error("Incorrect password. Please try again.");
                return;
            }

            toast.error(`There was an error: ${error.message || "Unknown error"}`);
            router.push("/");
        }
    };

    const isSignIn = type === "sign-in"

    return (
        <div className="card-border sm:min-w-[400px] md:min-w-[566px] mt-10">
            <div className="flex flex-col gap-6 py-14 px-10 dark-gradient rounded-2xl">
                <div className="flex flex-col gap-2 items-center text-center">
                    <Image className="animate-pulse" src="/logo.svg" alt="logo" height={32} width={38}/>
                    {type === "sign-in" ? (<h2 className="text-primary-100">Welcome Back</h2>) : (
                        <h2 className="text-primary-100">Create Account</h2>)}
                </div>

                <Form {...form}>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        const firstError = Object.values(errors)[0];
                        if (firstError && firstError.message) {
                            toast.error(firstError.message.toString());
                        }
                    })} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                                type="text"
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />

                        <Button className="!w-full !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer"
                                type="submit">
                            {isSignIn ? "Sign In" : "Create an Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
