import { For } from "solid-js";
import { Button, Grid } from "@suid/material";
import SxProps from "@suid/system/sxProps";
import { calendarHeight } from "../MonthCalendar";
import { MonthData } from "../models";
import DateFormat from "../format/DateFormat";

// Props for styling mont and year buttons
const sx: SxProps = {
    borderColor: "primary.main",
    borderStyle: "solid",
    color: "text.primary",
    fontSize: 14,
    height: 40,
    width: 40,
};

export function YearList(props: {
    years: number[];
    currentYear: number;
    onYearClick: (year: number) => void;
}) {
    return (
        <Grid container minHeight={calendarHeight}>
            <For each={props.years}>
                {(year) => (
                    <Grid item xs={3}>
                        <Button
                            variant="text"
                            aria-checked={props.currentYear === year ? "true" : undefined}
                            sx={{
                                ...sx,
                                borderWidth: props.currentYear === year ? 2 : undefined,
                            }}
                            onClick={() => props.onYearClick(year)}
                        >
                            {year}
                        </Button>
                    </Grid>
                )}
            </For>
        </Grid>
    );
}

export function MonthList(props: {
    months: MonthData[];
    onMonthClick: (date: Date) => void;
    format: DateFormat;
}) {
    return (
        <Grid container minHeight={calendarHeight}>
            <For each={props.months}>
                {(month) => (
                    <Grid item xs={3}>
                        <Button
                            variant="text"
                            aria-checked={month.selected ? "true" : undefined}
                            sx={{
                                ...sx,
                                borderWidth: month.selected ? 2 : undefined,
                                textTransform: "none",
                            }}
                            onClick={() => {
                                props.onMonthClick(month.date);
                            }}
                        >
                            {props.format.monthNameShort(month.date)}
                        </Button>
                    </Grid>
                )}
            </For>
        </Grid>
    );
}
