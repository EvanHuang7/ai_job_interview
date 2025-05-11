import {FormControl, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Control, Controller, FieldValues, Path} from "react-hook-form";
import {cn} from "@/lib/utils";

interface SelectFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    options: {
        value: string;
        label: string;
    }[];
}

const SelectField = <T extends FieldValues>({
                                                control,
                                                name,
                                                label,
                                                placeholder = "Select an option",
                                                options,
                                            }: SelectFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <FormItem>
                    <FormLabel className="!font-normal">{label}</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            <SelectTrigger
                                className={cn(
                                    "!bg-dark-200 !rounded-full !min-h-12 !px-5",
                                    fieldState.error && "border border-red-500"
                                )}
                            >
                                <SelectValue placeholder={placeholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};

export default SelectField;
