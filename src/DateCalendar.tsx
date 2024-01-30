import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { Button, Grid, Paper } from "@suid/material";
import useWeeks from "./useWeeks";
import { CommonCalendarProps, Optional } from "./models";
import MonthCalendar, { calendarWidth, extractCommonCalendarProps } from "./MonthCalendar";
import { addMonths, addYears, getToday, setYear } from "./dateUtils";
import ButtonLeft from "./components/ButtonLeft";
import ButtonRight from "./components/ButtonRight";
import DateFormat from "./format/DateFormat";
import { defaultLocale } from "./locale";
import Transition, { TransitionDirection } from "./components/Transition";
import useMonths from "./useMonts";
import { MonthList, YearList } from "./components/MonthYearList";
import { first, last } from "./arrayUtils";

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

export default function DateCalendar(props: DateCalendarProps) {
    const commonProps = extractCommonCalendarProps(props);
    const locale = createMemo(() => props.locale || defaultLocale());
    const value = createMemo(() => props.value);
    const today = getToday();

    const [selectMode, setSelectMode] = createSignal<Mode>("day");

    // The reference date is used when display mode is "month" or "year".
    const [referenceDate, setReferenceDate] = createSignal(today);
    const [transitionReferenceDate, setTransitionReferenceDate] = createSignal(today);

    // The calendar date is used when displayed mode is "day".
    const [calendarDate, setCalendarDate] = createSignal(today);

    const currentYear = createMemo(() => calendarDate().getFullYear());

    createEffect(() => {
        const valueDate = props.value;
        const referenceDate = props.referenceDate || today;
        const date = valueDate || referenceDate;

        setReferenceDate(date);
        setCalendarDate(date);
        setTransitionDate(date);
    });

    // When the reference date changes, update months and years.
    const { months, years } = useMonths(referenceDate, calendarDate);

    const [transitionDate, setTransitionDate] = createSignal(today);

    const { months: transitionMonths, years: transitionYears } = useMonths(
        transitionReferenceDate,
        calendarDate,
    );

    const [transitionDirection, setTransitionDirection] = createSignal<TransitionDirection>("none");

    const { weeks: transitionWeeks } = useWeeks(transitionDate, value, locale);

    const handleTransitionEnd = () => {
        setCalendarDate(transitionDate());
        setTransitionDirection("none");
    };

    const previousMonth = () => {
        setTransitionDate(addMonths(calendarDate(), -1));
        setTransitionDirection("prev");
    };

    const nextMonth = () => {
        setTransitionDate(addMonths(calendarDate(), 1));
        setTransitionDirection("next");
    };

    const previousYear = () => {
        setTransitionReferenceDate(addYears(referenceDate(), -1));
        setTransitionDirection("prev");
    };

    const nextYear = () => {
        setTransitionReferenceDate(addYears(referenceDate(), 1));
        setTransitionDirection("next");
    };

    const handleMonthTransitionEnd = () => {
        setReferenceDate(transitionReferenceDate());
        setTransitionDirection("none");
    };

    const handleMonthClick = (date: Date) => {
        setCalendarDate(date);
        setSelectMode("day");
    };

    const previousDecade = () => {
        setTransitionReferenceDate(addYears(referenceDate(), -20));
        setTransitionDirection("prev");
    };

    const nextDecade = () => {
        setTransitionReferenceDate(addYears(referenceDate(), 20));
        setTransitionDirection("next");
    };

    const handleYearTransitionEnd = () => {
        setReferenceDate(transitionReferenceDate());
        setTransitionDirection("none");
    };

    const handleYearClick = (year: number) => {
        setReferenceDate(setYear(calendarDate(), year));
        setSelectMode("month");
    };

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

                <Transition
                    onTransitionEnd={handleTransitionEnd}
                    width={calendarWidth}
                    transitionDirection={transitionDirection()}
                    transitionTo={
                        <MonthCalendar
                            {...commonProps}
                            onSelect={props.onChange}
                            weeks={transitionWeeks()}
                        />
                    }
                >
                    <MonthCalendar {...commonProps} onSelect={props.onChange} weeks={weeks()} />
                </Transition>
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
                <Transition
                    onTransitionEnd={handleMonthTransitionEnd}
                    width={calendarWidth}
                    transitionDirection={transitionDirection()}
                    transitionTo={
                        <MonthList
                            months={transitionMonths()}
                            onMonthClick={handleMonthClick}
                            format={format()}
                        />
                    }
                >
                    <MonthList
                        months={months()}
                        onMonthClick={handleMonthClick}
                        format={format()}
                    />
                </Transition>
            </Show>

            <Show when={selectMode() === "year"}>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item>{`${first(years())} - ${last(years())}`}</Grid>
                    <Grid item>
                        <ButtonLeft onClick={previousDecade} />
                        <ButtonRight onClick={nextDecade} />
                    </Grid>
                </Grid>
                <Transition
                    onTransitionEnd={handleYearTransitionEnd}
                    width={calendarWidth}
                    transitionDirection={transitionDirection()}
                    transitionTo={
                        <YearList
                            years={transitionYears()}
                            currentYear={currentYear()}
                            onYearClick={handleYearClick}
                        />
                    }
                >
                    <YearList
                        years={years()}
                        currentYear={currentYear()}
                        onYearClick={handleYearClick}
                    />
                </Transition>
            </Show>
        </Paper>
    );
}
