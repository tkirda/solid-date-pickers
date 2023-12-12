/**
 * Array of days in a week. If a day is null, then it 
 * should be rendered as an empty cell.
 */
export type Week = (DayData | null)[];

/**
 * Represents data for rendering a day value.
 */
export type DayData = {
    date: Date;
    day: number;
    selected: boolean;
};

/**
 * Represents data for rendering a month value.
 */
export type MonthData = {
    date: Date;
    selected: boolean;
};

/**
 * Represents a date range.
 */
export type DateRange = [Optional<Date>, Optional<Date>];

/**
 * Represents the common props for a calendar component.
 */
export type CommonCalendarProps = {
    /**
     * If true, then future dates will be disabled.
     */
    disableFuture?: boolean;

    /**
     * If true, then today's date will not be highlighted.
     */
    disableHighlightToday?: boolean;

    /**
     * If true, then past dates will be disabled.
     */
    disablePast?: boolean;

    /**
     * Calendar locale, defaults to browser locale.
     */
    locale?: string;

    /**
     * The maximum selectable date.
     */
    maxDate?: Date;

    /**
     * The minimum selectable date.
     */
    minDate?: Date;

    /**
     * If true, then the calendar will be read-only.
     */
    readOnly?: boolean;

    // TODO: Implement: showDaysOutsideCurrentMonth?: boolean;
};

/**
 * Represents an optional value of type T.
 * It can be either a value of type T, null, or undefined.
 */
export type Optional<T> = T | null | undefined;
