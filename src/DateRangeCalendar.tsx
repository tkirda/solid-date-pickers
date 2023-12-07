import { For, createEffect, createMemo, createSignal } from "solid-js";
import { Box, Divider, Grid, IconButton, Paper } from "@suid/material";
import ChevronLeftIcon from "@suid/icons-material/ChevronLeft";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";
import MonthCalendar, { calendarWidth, extractCommonCalendarProps } from "./MonthCalendar";
import useWeeks from "./useWeeks";
import { CommonCalendarProps, DateRange } from "./models";
import { addMonths, getToday } from "./dateUtils";
import DateFormat from "./format/DateFormat";

type CalendarCount = 1 | 2 | 3;

type DateRangePickerProps = {
    calendars?: CalendarCount;
    onChange: (value: DateRange) => void;
    referenceDate?: Date;
    value: DateRange;
} & CommonCalendarProps;

export default function DateRangePicker(props: DateRangePickerProps) {
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
                                <DateRangeCalendar
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

type MonthRangePickerProps = {
    onNext?: () => void;
    onPrevious?: () => void;
    onSelect: (date: Date) => void;
    range: DateRange;
    referenceDate: Date;
} & CommonCalendarProps;

function DateRangeCalendar(props: MonthRangePickerProps) {
    const commonProps = extractCommonCalendarProps(props);
    const range = createMemo(() => props.range);
    const referenceDate = createMemo(() => props.referenceDate);
    const locale = createMemo(() => props.locale || navigator.language);

    const { weeks } = useWeeks(referenceDate, range, locale);

    const dateFormat = createMemo(() => new DateFormat(props.locale || navigator.language));

    return (
        <Box width={calendarWidth}>
            <Grid container justifyContent="space-between" alignItems="center" height={40}>
                <Grid item xs={2}>
                    {props.onPrevious && (
                        <IconButton onClick={props.onPrevious}>
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                </Grid>
                <Grid item>{dateFormat().monthAndYear(referenceDate())}</Grid>
                <Grid item xs={2}>
                    {props.onNext && (
                        <IconButton onClick={props.onNext}>
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
            <MonthCalendar
                {...commonProps}
                onSelect={props.onSelect}
                range={props.range}
                weeks={weeks()}
            />
        </Box>
    );
}
