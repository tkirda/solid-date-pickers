import { createSignal } from "solid-js";
import { Box, Button } from "@suid/material";
import DateField from "../DateField";
import DateCalendar from "../DateCalendar";
import DateRangeCalendar from "../DateRangeCalendar";
import { DateRange } from "../models";

export default function Demo() {
    const [date, setDate] = createSignal<Date | null>(null);
    const [range, setRange] = createSignal<DateRange>([null, null]);

    return (
        <Box width={800} margin="0 auto">
            <h2>Overview</h2>
            <p>
                This is a collection of date picker components for SolidJS. Similar to MUI Date
                pickers.
            </p>
            <p>The package has a peer dependency on `@suid/material` and `@suid/icons-material`.</p>
            <h2>Date Field</h2>
            <p>The Date Field component lets users select a date with the keyboard.</p>
            <DateField label="Date Field" value={date()} onChange={setDate} />
            <h3>Customize the date format</h3>
            <DateField
                label="Format: YYYY-MM-DD HH:mm"
                format="YYYY-MM-DD HH:mm"
                value={date()}
                onChange={setDate}
            />
            <h2>Date Calendar</h2>
            <DateCalendar value={date()} onChange={setDate} />
            <h2>Date Range Calendar</h2>
            <DateField
                label="Date Start"
                value={range()[0]}
                onChange={(d) => setRange([d, range()[1]])}
            />{" "}
            <DateField
                label="Date End"
                value={range()[1]}
                onChange={(d) => setRange([range()[0], d])}
            />
            <br />
            <br />
            <DateRangeCalendar value={range()} calendars={2} onChange={setRange} />
            <br />
            <Button
                variant="outlined"
                disabled={range().every((v) => !v)}
                onClick={() => setRange([null, null])}
            >
                Clear
            </Button>
            <br />
            <br />
        </Box>
    );
}
