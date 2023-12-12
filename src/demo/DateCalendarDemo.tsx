import { createSignal } from "solid-js";
import { DateCalendar } from "solid-date-pickers";

export default function DateCalendarDemo() {
    const [date, setDate] = createSignal<Date>();

    return <DateCalendar disableHighlightToday onChange={setDate} value={date()} />;
}
