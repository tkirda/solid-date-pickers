import { createSignal } from "solid-js";
import { Button, Stack } from "@suid/material";
import { DateCalendar, DateField } from "../index";

export default function DateCalendarDemo() {
    const [date, setDate] = createSignal<Date>();

    return (
        <Stack spacing={2} marginBottom={2} width={272}>
            <DateField label="Date Field" value={date()} onChange={setDate} />
            <DateCalendar onChange={setDate} value={date()} />
            <Button disabled={!date()} onClick={() => setDate(undefined)} variant="outlined">
                Clear
            </Button>
        </Stack>
    );
}
