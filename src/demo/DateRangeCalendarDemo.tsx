import { createSignal } from "solid-js";
import { DateRangeCalendar, DateRange } from "solid-date-pickers";
import { Button } from "@suid/material";

export default function DateRangeCalendarDemo() {
    const [range, setRange] = createSignal<DateRange>([null, null]);

    return (
        <>
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
        </>
    );
}
