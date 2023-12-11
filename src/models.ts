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

export type DateRange = [Optional<Date>, Optional<Date>];

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

export type Optional<T> = T | null | undefined;
