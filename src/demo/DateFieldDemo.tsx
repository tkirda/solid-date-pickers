import { createSignal } from "solid-js";
import { DateField } from "../index";

export default function DateFieldDemo() {
    const [date, setDate] = createSignal<Date>();

    return <DateField label="Date Field" value={date()} onChange={setDate} />;
}
