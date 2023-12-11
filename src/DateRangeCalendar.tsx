import { For, createEffect, createMemo, createSignal } from "solid-js";
import { Divider, Grid, Paper } from "@suid/material";
import { extractCommonCalendarProps } from "./MonthCalendar";
import { CommonCalendarProps, DateRange, Optional } from "./models";
import { addMonths, getToday, isSameDay } from "./dateUtils";
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
    const [overDate, setOverDate] = createSignal<Date | undefined>();

    const [calendarDate, setCalendarDate] = createSignal(
        range()[0] || props.referenceDate || getToday(),
    );

    const calendarCount = createMemo(() => props.calendars || 2);

    createEffect((prevStartDate: Optional<Date>) => {
        setRange(props.value);

        const startDate = props.value[0];

        // When the start date changes, update the calendar date.
        if (prevStartDate && startDate && !isSameDay(prevStartDate, startDate)) {
            setCalendarDate(startDate);
        }

        return startDate;
    }, props.value[0]);

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

    let timeout: ReturnType<typeof setTimeout>;

    const handleMouseOut = () => {
        // This is to prevent the overDate from being cleared
        // when the mouse moves from one day to another.
        timeout = setTimeout(() => setOverDate(undefined), 100);
    };

    const handleMouseOver = (date: Date) => {
        clearTimeout(timeout);

        const [start] = range();

        if (!start) return;

        setOverDate(date);
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
                                    onMouseOut={handleMouseOut}
                                    onMouseOver={handleMouseOver}
                                    overDate={overDate()}
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
