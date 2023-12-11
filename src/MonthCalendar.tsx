import { For, createMemo, splitProps } from "solid-js";
import { CommonCalendarProps, DateRange, DayData, Week } from "./models";
import { Box, IconButton, Stack, Typography } from "@suid/material";
import { isSameDay, isToday, getToday } from "./dateUtils";
import DateFormat from "./format/DateFormat";

type MonthCalendarProps = {
    onMouseOut?: () => void;
    onMouseOver?: (date: Date) => void;
    onSelect: (date: Date) => void;
    overDate?: Date;
    range?: DateRange;
    weeks: Week[];
} & CommonCalendarProps;

const getBorderWidth = (day: DayData, disableHighlightToday?: boolean) => {
    if (day.selected) return 2;
    if (disableHighlightToday) return undefined;

    return isToday(day.date) ? 1 : undefined;
};

export const calendarWidth = 240;

export const calendarHeight = 210;

export const extractCommonCalendarProps = <T extends CommonCalendarProps>(props: T) => {
    const [commonProps] = splitProps(props, [
        "disableFuture",
        "disableHighlightToday",
        "disablePast",
        "locale",
        "maxDate",
        "minDate",
        "readOnly",
    ]);

    return commonProps as CommonCalendarProps;
};

export default function MonthCalendar(props: MonthCalendarProps) {
    const weekDayLabels = createMemo(() =>
        new DateFormat(props.locale || navigator.language).getWeekDayLabels(),
    );

    const sx = {
        width: 30,
        height: 30,
        fontSize: 14,
        borderColor: "primary.main",
        borderStyle: "solid",
    };

    const isInBetween = (day: DayData) => {
        if (!props.range) {
            return false;
        }

        const [rangeStart, rangeEnd] = props.range;

        let start = rangeStart;
        let end = rangeEnd || props.overDate;

        if (!start || !end) {
            return false;
        }

        // Swap start and end if start is after end
        if (start > end) {
            [start, end] = [end, start];
        }

        return (
            (day.date > start && day.date < end) ||
            isSameDay(day.date, start) ||
            isSameDay(day.date, end)
        );
    };

    const isDisabled = (day: DayData) => {
        const today = getToday();

        if (
            (props.disablePast && day.date < today) ||
            (props.disableFuture && day.date > today) ||
            (props.minDate && day.date < props.minDate) ||
            (props.maxDate && day.date > props.maxDate)
        ) {
            return true;
        }

        return false;
    };

    const getBackgroundColor = (day: DayData | null) => {
        return day && isInBetween(day) ? "rgba(144, 202, 249, 0.12)" : undefined;
    };

    const getBorderRadius = (day: DayData | null) => {
        if (!day || !props.range) {
            return undefined;
        }

        const [rangeStart, rangeEnd] = props.range;

        let end = rangeEnd || props.overDate;
        let start = rangeStart;

        // Swap start and end if start is after end
        if (start && end && start > end) {
            [start, end] = [end, start];
        }

        if (start && end && isSameDay(start, end)) {
            return "50%";
        }

        // Round the first and last day of the range
        if (start && isSameDay(start, day.date)) {
            return "50% 0 0 50%";
        } else if (end && isSameDay(end, day.date)) {
            return "0 50% 50% 0";
        }

        return undefined;
    };

    return (
        <Box minHeight={calendarHeight}>
            <Stack direction="row" marginBottom={1} marginTop={1}>
                <For each={weekDayLabels()}>
                    {(label) => (
                        <Typography fontWeight="bold" fontSize="small" flex={1}>
                            {label}
                        </Typography>
                    )}
                </For>
            </Stack>
            <For each={props.weeks}>
                {(week) => (
                    <Stack direction="row" spacing={0} style={{ display: "flex", width: "100%" }}>
                        <For each={week}>
                            {(day) => (
                                <Box
                                    flex={1}
                                    backgroundColor={getBackgroundColor(day)}
                                    borderRadius={getBorderRadius(day)}
                                >
                                    {day ? (
                                        <IconButton
                                            disabled={isDisabled(day)}
                                            sx={{
                                                ...sx,
                                                borderWidth: getBorderWidth(
                                                    day,
                                                    props.disableHighlightToday,
                                                ),
                                            }}
                                            onClick={
                                                props.readOnly
                                                    ? undefined
                                                    : () => props.onSelect(day.date)
                                            }
                                            onMouseOut={props.onMouseOut}
                                            onMouseOver={
                                                props.onMouseOver && [props.onMouseOver, day.date]
                                            }
                                        >
                                            {day.day}
                                        </IconButton>
                                    ) : null}
                                </Box>
                            )}
                        </For>
                    </Stack>
                )}
            </For>
        </Box>
    );
}
