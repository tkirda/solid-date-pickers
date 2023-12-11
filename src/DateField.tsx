import { ComponentProps, splitProps } from "solid-js";
import { TextField } from "@suid/material";
import useDateField from "./useDateField";

type TextFieldProps = ComponentProps<typeof TextField>;

export type DateFieldProps = {
    value?: Date | null;
    format?: string;
    onChange?: (date: Date | null) => void;
} & Omit<TextFieldProps, "value" | "onChange">;

export default function DateField(props: DateFieldProps) {
    const [local, other] = splitProps(props, ["value", "format", "onChange"]);
    const { inputRef, error } = useDateField(local);

    return <TextField {...other} error={props.error || error()} inputRef={inputRef} />;
}
