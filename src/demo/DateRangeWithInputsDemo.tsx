import { createSignal, createMemo } from "solid-js";
import { Button, Box, Stack } from "@suid/material";
import { DateField, DateRangeCalendar, DateRange, Optional } from "../index";

export default function DateRangeWithInputsDemo() {
    const [range, setRange] = createSignal<DateRange>([null, null]);
    const startDate = createMemo(() => range()[0]);
    const endDate = createMemo(() => range()[1]);
    const setStartDate = (date: Optional<Date>) => setRange([date, endDate()]);
    const setEndDate = (date: Optional<Date>) => setRange([startDate(), date]);

    return (
        <Box>
            <Stack direction="row" spacing={2} marginBottom={2}>
                <DateField label="Date Start" onChange={setStartDate} value={startDate()} />
                <DateField label="Date End" onChange={setEndDate} value={endDate()} />
            </Stack>

            <DateRangeCalendar
                calendars={2}
                disableHighlightToday
                onChange={setRange}
                value={range()}
            />

            <br />
            
            <Button
                variant="outlined"
                disabled={range().every((v) => !v)}
                onClick={() => setRange([null, null])}
            >
                Clear
            </Button>
        </Box>
    );
}
