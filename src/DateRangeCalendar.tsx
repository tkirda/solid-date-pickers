import { For, createEffect, createMemo, createSignal } from "solid-js";
import { Divider, Grid, Paper } from "@suid/material";
import { extractCommonCalendarProps } from "./MonthCalendar";
import { CommonCalendarProps, DateRange } from "./models";
import { addMonths, getToday } from "./dateUtils";
import DateRangeMonthCalendar from "./DateRangeMonthCalendar";

type CalendarCount = 1 | 2 | 3;

export type DateRangeCalendarProps = {
    calendars?: CalendarCount;
    onChange: (value: DateRange) => void;
    referenceDate?: Date;
    value: DateRange;
} & CommonCalendarProps;

export default function DateRangeCalendar(props: DateRangeCalendarProps) {
    const commonProps = extractCommonCalendarProps(props);

    const [range, setRange] = createSignal<DateRange>(props.value || [null, null]);

    const [calendarDate, setCalendarDate] = createSignal(
        range()[0] || props.referenceDate || getToday(),
    );

    const calendarCount = createMemo(() => props.calendars || 2);

    createEffect(() => {
        setRange(props.value);
    });

    const calendarDates = createMemo(() =>
        Array.from({ length: calendarCount() }, (_, i) => addMonths(calendarDate(), i)),
    );

    const prevMonth = () => setCalendarDate(addMonths(calendarDate(), -1));

    const nextMonth = () => setCalendarDate(addMonths(calendarDate(), 1));

    const handleSelect = (date: Date) => {
        const [start, end] = range();

        if ((!start && !end) || (start && end)) {
            setRange([date, null]);
        } else if (start) {
            setRange(date < start ? [date, start] : [start, date]);
        } else if (end) {
            setRange(date < end ? [date, end] : [end, date]);
        }

        props.onChange(range());
    };

    const isLast = (index: number) => calendarCount() - 1 === index;

    return (
        <Paper sx={{ width: calendarCount() * 280 + 20, minHeight: 260, p: 2 }}>
            <Grid container justifyContent="space-between">
                <For each={calendarDates()}>
                    {(referenceDate, index) => (
                        <>
                            <Grid item>
                                <DateRangeMonthCalendar
                                    {...commonProps}
                                    onNext={isLast(index()) ? nextMonth : undefined}
                                    onPrevious={index() === 0 ? prevMonth : undefined}
                                    onSelect={handleSelect}
                                    range={range()}
                                    referenceDate={referenceDate}
                                />
                            </Grid>
                            {!isLast(index()) && (
                                <Grid item>
                                    <Divider orientation="vertical" />
                                </Grid>
                            )}
                        </>
                    )}
                </For>
            </Grid>
        </Paper>
    );
}
