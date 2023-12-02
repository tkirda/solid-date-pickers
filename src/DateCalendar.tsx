import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { Button, Grid, IconButton, Paper } from "@suid/material";
import ChevronLeftIcon from "@suid/icons-material/ChevronLeft";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";
import useDayPicker from "./useDayPicker";
import { CommonCalendarProps, MonthData } from "./models";
import MonthCalendar, { calendarWidth, extractCommonCalendarProps } from "./MonthCalendar";
import { addMonths, addYears, isSameMonth, getToday, setYear, setMonth } from "./dateUtils";
import { monthAndYear, monthNameShort } from "./dateFormat";

export type DayPickerProps = {
    onChange: (date: Date | null) => void;
    referenceDate?: Date;
    value?: Date | null;
} & CommonCalendarProps;

type Mode = "day" | "month" | "year";

/**
 * Returns the first element of an array.
 */
const first = <T,>(arr: T[]): T => arr[0];

/**
 * Returns the last element of an array.
 */
const last = <T,>(arr: T[]): T => arr[arr.length - 1];

export default function DateCalendar(props: DayPickerProps) {
    const commonProps = extractCommonCalendarProps(props);

    const selectedDate = createMemo(() => props.value);
    const today = getToday();

    const [selectMode, setSelectMode] = createSignal<Mode>("day");
    const [months, setMonths] = createSignal<MonthData[]>([]);
    const [years, setYears] = createSignal<number[]>([]);

    // The reference date is used when display mode is "month" or "year".
    const [referenceDate, setReferenceDate] = createSignal(
        props.value || props.referenceDate || today,
    );

    // The calendar date is used when displayed mode is "day".
    const [calendarDate, setCalendarDate] = createSignal(referenceDate());

    // When the value changes, update the calendar date.
    createEffect(() => {
        setCalendarDate(props.value || today);
    });

    // When the reference date changes, update months and years.
    createEffect(() => {
        const months: MonthData[] = [];

        for (let i = 0; i < 12; i++) {
            const date = setMonth(referenceDate(), i);

            months.push({
                date: date,
                selected: isSameMonth(date, calendarDate()),
            });
        }

        setMonths(months);

        const years: number[] = [];
        const currentYear = referenceDate().getFullYear();

        for (let i = currentYear - 10; i < currentYear + 10; i++) {
            years.push(i);
        }

        setYears(years);
    });

    const previousMonth = () => setCalendarDate(addMonths(calendarDate(), -1));

    const nextMonth = () => setCalendarDate(addMonths(calendarDate(), 1));

    const previousYear = () => setReferenceDate(addYears(referenceDate(), -1));

    const nextYear = () => setReferenceDate(addYears(referenceDate(), 1));

    const previousDecade = () => setReferenceDate(addYears(referenceDate(), -20));

    const nextDecade = () => setReferenceDate(addYears(referenceDate(), 20));

    const { weeks } = useDayPicker(calendarDate, selectedDate);

    return (
        <Paper sx={{ width: calendarWidth + 32, minHeight: 290, p: 2 }}>
            <Show when={selectMode() === "day"}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setSelectMode("month")}
                        >
                            {monthAndYear(calendarDate())}
                        </Button>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={previousMonth} size="small">
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={nextMonth} size="small">
                            <ChevronRightIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <MonthCalendar {...commonProps} onSelect={props.onChange} weeks={weeks()} />
            </Show>

            <Show when={selectMode() === "month"}>
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item>
                        <Button variant="text" onClick={() => setSelectMode("year")}>
                            {referenceDate().getFullYear()}
                        </Button>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={previousYear}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={nextYear}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container>
                    <For each={months()}>
                        {(month) => (
                            <Grid item xs={3}>
                                <IconButton
                                    sx={{
                                        height: 60,
                                        width: 60,
                                        fontSize: 12,
                                        borderColor: "primary.main",
                                        borderStyle: "solid",
                                        borderWidth: month.selected ? 2 : undefined,
                                    }}
                                    onClick={() => {
                                        setCalendarDate(month.date);
                                        setSelectMode("day");
                                    }}
                                >
                                    {monthNameShort(month.date)}
                                </IconButton>
                            </Grid>
                        )}
                    </For>
                </Grid>
            </Show>

            <Show when={selectMode() === "year"}>
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item>{`${first(years())} - ${last(years())}`}</Grid>
                    <Grid item>
                        <IconButton onClick={previousDecade}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={nextDecade}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container>
                    <For each={years()}>
                        {(year) => (
                            <Grid item xs={3}>
                                <IconButton
                                    sx={{
                                        height: 50,
                                        width: 50,
                                        fontSize: 12,
                                        borderColor: "primary.main",
                                        borderStyle: "solid",
                                        borderWidth:
                                            calendarDate().getFullYear() === year ? 2 : undefined,
                                    }}
                                    onClick={() => {
                                        setReferenceDate(setYear(calendarDate(), year));
                                        setSelectMode("month");
                                    }}
                                >
                                    {year}
                                </IconButton>
                            </Grid>
                        )}
                    </For>
                </Grid>
            </Show>
        </Paper>
    );
}
