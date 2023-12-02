import { For, splitProps } from "solid-js";
import { CommonCalendarProps, DateRange, DayData, Week } from "./models";
import { Box, IconButton, Stack, Typography } from "@suid/material";
import { isSameDay, isToday, getToday } from "./dateUtils";
import { getFirstDayOfWeek, getWeekDayLabels } from "./dateFormat";

type MonthCalendarProps = {
    onSelect: (date: Date) => void;
    range?: DateRange;
    weeks: Week[];
} & CommonCalendarProps;

const getBorderWidth = (day: DayData) => {
    return day.selected ? 2 : isToday(day.date) ? 1 : undefined;
};

export const calendarWidth = 240;

export const extractCommonCalendarProps = <T extends CommonCalendarProps>(props: T) => {
    const [commonProps] = splitProps(props, [
        "disableFuture",
        "disablePast",
        "maxDate",
        "minDate",
        "readOnly",
    ]);

    return commonProps as CommonCalendarProps;
};

export default function MonthCalendar(props: MonthCalendarProps) {
    const localeFirstDay = getFirstDayOfWeek();
    const weekDayLabels = getWeekDayLabels(localeFirstDay);

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

        const [start, end] = props.range;

        if (!start || !end) {
            return false;
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
        return day && isInBetween(day) ? "background.default" : undefined;
    };

    const getBorderRadius = (day: DayData | null) => {
        if (!day || !props.range) {
            return undefined;
        }

        const [start, end] = props.range;

        // Round the first and last day of the range
        if (start && isSameDay(start, day.date)) {
            return "50% 0 0 50%";
        } else if (end && isSameDay(end, day.date)) {
            return "0 50% 50% 0";
        }

        return undefined;
    };

    return (
        <div>
            <Stack direction="row" marginBottom={1} marginTop={1}>
                <For each={weekDayLabels}>
                    {(label) => (
                        <Typography fontWeight="bold" fontSize="small" style={{ flex: 1 }}>
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
                                                backgroundColor: getBackgroundColor(day),
                                                borderWidth: getBorderWidth(day),
                                            }}
                                            onClick={() =>
                                                !props.readOnly && props.onSelect(day.date)
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
        </div>
    );
}
