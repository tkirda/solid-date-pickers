import { Accessor, createEffect, createSignal } from "solid-js";
import { MonthData } from "./models";
import { isSameMonth, setMonth } from "./dateUtils";

export default function useMonths(referenceDate: Accessor<Date>, calendarDate: Accessor<Date>) {
    const [months, setMonths] = createSignal<MonthData[]>([]);
    const [years, setYears] = createSignal<number[]>([]);

    createEffect(() => {
        const rDate = referenceDate();
        const cDate = calendarDate();

        const monthsArr: MonthData[] = [];

        for (let i = 0; i < 12; i++) {
            const date = setMonth(rDate, i);
            const selected = isSameMonth(date, cDate);

            monthsArr.push({
                date: date,
                selected: selected,
            });
        }

        setMonths(monthsArr);

        const yearsArr: number[] = [];
        const currentYear = rDate.getFullYear();

        for (let i = currentYear - 10; i < currentYear + 10; i++) {
            yearsArr.push(i);
        }

        setYears(yearsArr);
    });

    return { months, years };
}
