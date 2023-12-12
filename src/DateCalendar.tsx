import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { Button, Grid, IconButton, Paper } from "@suid/material";
import useWeeks from "./useWeeks";
import { CommonCalendarProps, MonthData, Optional } from "./models";
import MonthCalendar, {
    calendarHeight,
    calendarWidth,
    extractCommonCalendarProps,
} from "./MonthCalendar";
import { addMonths, addYears, isSameMonth, getToday, setYear, setMonth } from "./dateUtils";
import ButtonLeft from "./components/ButtonLeft";
import ButtonRight from "./components/ButtonRight";
import DateFormat from "./format/DateFormat";
import { defaultLocale } from "./locale";

export type DateCalendarProps = {
    /**
     * On change callback.
     */
    onChange: (date: Optional<Date>) => void;

    /**
     * Reference date, used to determine which month to display if "value" is not set.
     */
    referenceDate?: Date;

    /**
     * Date value.
     */
    value?: Optional<Date>;
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

export default function DateCalendar(props: DateCalendarProps) {
    const commonProps = extractCommonCalendarProps(props);
    const locale = createMemo(() => props.locale || defaultLocale());
    const value = createMemo(() => (props.value ? new Date(props.value) : undefined));
    const today = getToday();

    const [selectMode, setSelectMode] = createSignal<Mode>("day");
    const [months, setMonths] = createSignal<MonthData[]>([]);
    const [years, setYears] = createSignal<number[]>([]);

    // The reference date is used when display mode is "month" or "year".
    const [referenceDate, setReferenceDate] = createSignal(
        value() || props.referenceDate || today,
    );

    // The calendar date is used when displayed mode is "day".
    const [calendarDate, setCalendarDate] = createSignal(referenceDate());

    // When the value changes, update the calendar date.
    createEffect(() => {
        setCalendarDate(value() || today);
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

    const { weeks } = useWeeks(calendarDate, value, locale);

    const format = createMemo(() => new DateFormat(locale()));

    return (
        <Paper sx={{ width: calendarWidth + 32, p: 2 }}>
            <Show when={selectMode() === "day"}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setSelectMode("month")}
                        >
                            {format().monthAndYear(calendarDate())}
                        </Button>
                    </Grid>
                    <Grid item>
                        <ButtonLeft onClick={previousMonth} />
                        <ButtonRight onClick={nextMonth} />
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
                        <ButtonLeft onClick={previousYear} />
                        <ButtonRight onClick={nextYear} />
                    </Grid>
                </Grid>
                <Grid container minHeight={calendarHeight}>
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
                                    {format().monthNameShort(month.date)}
                                </IconButton>
                            </Grid>
                        )}
                    </For>
                </Grid>
            </Show>

            <Show when={selectMode() === "year"}>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item>{`${first(years())} - ${last(years())}`}</Grid>
                    <Grid item>
                        <ButtonLeft onClick={previousDecade} />
                        <ButtonRight onClick={nextDecade} />
                    </Grid>
                </Grid>
                <Grid container minHeight={calendarHeight}>
                    <For each={years()}>
                        {(year) => (
                            <Grid item xs={3}>
                                <IconButton
                                    sx={{
                                        height: 40,
                                        width: 40,
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
