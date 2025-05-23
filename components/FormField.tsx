import {Control, Controller, FieldValues, Path} from "react-hook-form";

import {FormControl, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "textarea" | "number";
    disable?: boolean;
}

const FormField = <T extends FieldValues>({
                                              control,
                                              name,
                                              label,
                                              placeholder,
                                              type = "text",
                                              disable = false,
                                          }: FormFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <FormItem>
                    <FormLabel className="!font-normal">{label}</FormLabel>
                    <FormControl>
                        {type === "textarea" ? (
                            <Textarea
                                className={cn(
                                    "bg-dark-200 rounded-xl px-5 py-3 max-w-[482px] h-[120px]",
                                    fieldState.error && "border-red-500", name === "jobDescription" ? "max-w-[750px]" : "max-w-[482px]"
                                )}
                                placeholder={placeholder}
                                {...field}
                                disabled={disable}
                            />
                        ) : (
                            <Input
                                className={cn(
                                    "!bg-dark-200 !rounded-full !min-h-12 !px-5",
                                    fieldState.error && "border-red-500"
                                )}
                                type={type}
                                placeholder={placeholder}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                    const value = type === "number" ? Number(e.target.value) : e.target.value;
                                    field.onChange(value);
                                }}
                                disabled={disable}
                            />
                        )}
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};

export default FormField;