import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { Button, Grid, Paper } from "@suid/material";
import SxProps from "@suid/system/sxProps";
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

// Props for styling mont and year buttons
const sx: SxProps = {
    borderColor: "primary.main",
    borderStyle: "solid",
    color: "text.primary",
    fontSize: 14,
    height: 40,
    width: 40,
};

export default function DateCalendar(props: DateCalendarProps) {
    const commonProps = extractCommonCalendarProps(props);
    const locale = createMemo(() => props.locale || defaultLocale());
    const value = createMemo(() => props.value);
    const today = getToday();

    const [selectMode, setSelectMode] = createSignal<Mode>("day");
    const [months, setMonths] = createSignal<MonthData[]>([]);
    const [years, setYears] = createSignal<number[]>([]);

    // The reference date is used when display mode is "month" or "year".
    const [referenceDate, setReferenceDate] = createSignal(today);

    // The calendar date is used when displayed mode is "day".
    const [calendarDate, setCalendarDate] = createSignal(today);

    const currentYear = createMemo(() => calendarDate().getFullYear());

    createEffect(() => {
        const valueDate = props.value;
        const referenceDate = props.referenceDate || today;
        const date = valueDate || referenceDate;

        setReferenceDate(date);
        setCalendarDate(date);
    });

    // When the reference date changes, update months and years.
    createEffect(() => {
        const rDate = referenceDate();
        const cDate = calendarDate();

        const months: MonthData[] = [];

        for (let i = 0; i < 12; i++) {
            const date = setMonth(rDate, i);

            months.push({
                date: date,
                selected: isSameMonth(date, cDate),
            });
        }

        setMonths(months);

        const years: number[] = [];
        const currentYear = rDate.getFullYear();

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
                                <Button
                                    aria-checked={month.selected ? "true" : undefined}
                                    sx={{
                                        ...sx,
                                        borderWidth: month.selected ? 2 : undefined,
                                        textTransform: "none",
                                    }}
                                    onClick={() => {
                                        setCalendarDate(month.date);
                                        setSelectMode("day");
                                    }}
                                >
                                    {format().monthNameShort(month.date)}
                                </Button>
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
                                <Button
                                    aria-checked={currentYear() === year ? "true" : undefined}
                                    sx={{
                                        ...sx,
                                        borderWidth: currentYear() === year ? 2 : undefined,
                                    }}
                                    onClick={() => {
                                        setReferenceDate(setYear(calendarDate(), year));
                                        setSelectMode("month");
                                    }}
                                >
                                    {year}
                                </Button>
                            </Grid>
                        )}
                    </For>
                </Grid>
            </Show>
        </Paper>
    );
}
