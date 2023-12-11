export type Week = (DayData | null)[];

export type DayData = {
    date: Date;
    day: number;
    selected: boolean;
};

export type MonthData = {
    date: Date;
    selected: boolean;
};

export type DateRange = [Date | null, Date | null];

export type CommonCalendarProps = {
    disableFuture?: boolean;
    disableHighlightToday?: boolean;
    disablePast?: boolean;
    locale?: string;
    maxDate?: Date;
    minDate?: Date;
    readOnly?: boolean;

    // TODO: Implement these
    // showDaysOutsideCurrentMonth?: boolean;
};
