import { For, createMemo, splitProps } from "solid-js";
import { Box, Button, Stack, Typography } from "@suid/material";
import SxProps from "@suid/system/sxProps";
import { CommonCalendarProps, DateRange, DayData, Week } from "./models";
import { isSameDay, isToday, getToday } from "./dateUtils";
import DateFormat from "./format/DateFormat";
import { defaultLocale } from "./locale";

type MonthCalendarProps = {
    onMouseOut?: () => void;
    onMouseOver?: (date: Date) => void;
    onSelect: (date: Date) => void;
    overDate?: Date;
    range?: DateRange;
    weeks: Week[];
} & CommonCalendarProps;

const getBorderWidth = (day: DayData) => (day.selected ? 2 : undefined);

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
    const weekdays = createMemo(() =>
        new DateFormat(props.locale || defaultLocale()).getWeekdays(),
    );

    // Props for styling day buttons
    const sx: SxProps = {
        borderColor: "primary.main",
        borderStyle: "solid",
        color: "text.primary",
        fontSize: 14,
        height: 30,
        minWidth: "none",
        padding: 0,
        width: "100%",
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

    const getBackgroundColor = (day: DayData | null, disableHighlightToday?: boolean) => {
        if (!disableHighlightToday && day && isToday(day.date)) {
            return "rgba(144, 202, 249, 0.12)";
        }

        return day && isInBetween(day) ? "rgba(144, 202, 249, 0.12)" : undefined;
    };

    const getBorderRadius = (day: DayData | null, disableHighlightToday?: boolean) => {
        const radius = "4px";

        if (!disableHighlightToday && day && isToday(day.date)) {
            // Do not round corners if today is in the range when using range selection
            if (!isInBetween(day)) {
                return radius;
            }
        }

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
            return radius;
        }

        // Round the first and last day of the range
        if (start && isSameDay(start, day.date)) {
            return `${radius} 0 0 ${radius}`;
        } else if (end && isSameDay(end, day.date)) {
            return `0 ${radius} ${radius} 0`;
        }

        return undefined;
    };

    return (
        <Box minHeight={calendarHeight} role="grid">
            <Stack direction="row" marginBottom={1} marginTop={1} role="row">
                <For each={weekdays()}>
                    {(weekday) => (
                        <Typography
                            arial-label={weekday.long}
                            as="span"
                            flex={1}
                            fontSize="small"
                            fontWeight="bold"
                            role="columnheader"
                        >
                            {weekday.short}
                        </Typography>
                    )}
                </For>
            </Stack>
            <For each={props.weeks}>
                {(week) => (
                    <Stack direction="row" displayRaw="flex" role="row" spacing={0} width="100%">
                        <For each={week}>
                            {(day) => (
                                <Box
                                    flex={1}
                                    backgroundColor={getBackgroundColor(
                                        day,
                                        props.disableHighlightToday,
                                    )}
                                    borderRadius={getBorderRadius(day)}
                                    role="gridcell"
                                    onMouseOut={props.onMouseOut}
                                    onMouseOver={
                                        props.onMouseOver && day
                                            ? [props.onMouseOver, day.date]
                                            : undefined
                                    }
                                >
                                    {day ? (
                                        <Button
                                            disabled={isDisabled(day)}
                                            disableRipple
                                            sx={{
                                                ...sx,
                                                borderWidth: getBorderWidth(day),
                                            }}
                                            onClick={
                                                props.readOnly
                                                    ? undefined
                                                    : () => props.onSelect(day.date)
                                            }
                                        >
                                            {day.day}
                                        </Button>
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
