import { Accessor, createEffect, createSignal } from "solid-js";
import { DateRange, DayData, Optional, Week } from "./models";
import { getMonthFirstDay, getDaysInMonth, isSameDay, setDate, isDate } from "./dateUtils";
import DateFormat from "./format/DateFormat";

/**
 * Custom hook that generates an array of weeks for a given calendar date and selected date.
 * Each week is an array of DayData objects representing the days in that week.
 *
 * @param calendarDate - The calendar date for which to generate the weeks.
 * @param selectedDate - The selected date or date range.
 */
export default function useWeeks(
    calendarDate: Accessor<Date>,
    selectedDate: Accessor<Optional<Date>> | Accessor<DateRange | null>,
    locale: Accessor<string>,
) {
    const [weeks, setWeeks] = createSignal<Week[]>([]);

    createEffect(() => {
        const currentDate = calendarDate();
        const dateOrRange = selectedDate();
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfWeek = new DateFormat(locale()).getFirstDayOfWeek();
        const dayOfWeek = getMonthFirstDay(currentDate);
        const weekStartsOnSunday = firstDayOfWeek === 7;

        // Calculate how many days from the previous month should be displayed
        // on a calendar view, based on the first day of the month and whether
        // the week starts on Sunday or Monday.
        const prevMonthDayCount = (7 + dayOfWeek + (weekStartsOnSunday ? 0 : -1)) % 7;

        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = setDate(currentDate, day);

            const selected = Boolean(
                Array.isArray(dateOrRange)
                    ? dateOrRange.some((d) => isDate(d) && isSameDay(date, d))
                    : isDate(dateOrRange)
                      ? isSameDay(date, dateOrRange)
                      : false,
            );

            const data: DayData = {
                day: day,
                date: date,
                selected: selected,
            };

            return data;
        });

        // We always display 6 weeks on the calendar view, so we need to
        // calculate how many days from the next month should be displayed
        const nextMonthDayCount = 6 * 7 - (days.length + prevMonthDayCount);

        const combinedDays: Week = [
            ...Array(prevMonthDayCount).fill(null),
            ...days,
            ...Array(nextMonthDayCount).fill(null),
        ];

        const weeks: Week[] = [];

        while (combinedDays.length) {
            weeks.push(combinedDays.splice(0, 7));
        }

        setWeeks(weeks);
    });

    return { weeks };
}
