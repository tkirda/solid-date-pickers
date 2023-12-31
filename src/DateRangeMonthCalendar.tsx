import { createMemo } from "solid-js";
import { Box, Grid, IconButton } from "@suid/material";
import ChevronLeftIcon from "@suid/icons-material/ChevronLeft";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";
import MonthCalendar, { calendarWidth, extractCommonCalendarProps } from "./MonthCalendar";
import useWeeks from "./useWeeks";
import { CommonCalendarProps, DateRange } from "./models";
import DateFormat from "./format/DateFormat";
import { defaultLocale } from "./locale";

type DateRangeMonthCalendarProps = {
    onNext?: () => void;
    onPrevious?: () => void;
    onMouseOut?: () => void;
    onMouseOver?: (date: Date) => void;
    onSelect: (date: Date) => void;
    overDate?: Date;
    range: DateRange;
    referenceDate: Date;
} & CommonCalendarProps;

export default function DateRangeMonthCalendar(props: DateRangeMonthCalendarProps) {
    const commonProps = extractCommonCalendarProps(props);
    const range = createMemo(() => props.range);
    const referenceDate = createMemo(() => props.referenceDate);
    const locale = createMemo(() => props.locale || defaultLocale());

    const { weeks } = useWeeks(referenceDate, range, locale);

    const dateFormat = createMemo(() => new DateFormat(props.locale || defaultLocale()));

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
                onMouseOut={props.onMouseOut}
                onMouseOver={props.onMouseOver}
                onSelect={props.onSelect}
                overDate={props.overDate}
                range={props.range}
                weeks={weeks()}
            />
        </Box>
    );
}
