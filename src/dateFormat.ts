/**
 * Default configuration options for date formatting.
 */
export const defaults = {
    // locale: "en-US",
    // locale: "lt-LT",
    // locale: "ru-RU",
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
};

/**
 * Get the format for date and time based on the provided options.
 * @param options - The options for formatting the date and time.
 * @returns The formatted date and time.
 */
const getFormat = (options: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(defaults.locale, options);
};

/**
 * Get the long name of the month for the specified date.
 * @param date - The date object.
 * @returns The long name of the month.
 */
export const monthNameLong = (date: Date) => {
    return getFormat({ month: "long" }).format(date);
};

/**
 * Returns the short name of the month for the given date.
 * @param date - The date object.
 * @returns The short name of the month.
 */
export const monthNameShort = (date: Date) => {
    return getFormat({ month: "short" }).format(date);
};

/**
 * Get the month and year for the specified date.
 * @param date - The date object.
 * @returns The formatted month and year.
 */
export const monthAndYear = (date: Date) => {
    return getFormat({ month: "long", year: "numeric" }).format(date);
};

/**
 * Get the short name of the weekday for the specified date.
 * @param date - The date object.
 * @returns The short name of the weekday.
 */
export const weekdayNameShort = (date: Date) => {
    return getFormat({ weekday: "short" }).format(date);
};

/**
 * Returns an array of week day names starting from the specified first day.
 * @param firstDay - The index of the first day of the week (1 for Monday, 7 for Sunday).
 * @returns An array of week day names.
 */
export const getWeekDayLabels = (firstDay: FirstDay) => {
    const days: string[] = [];
    const sunday = new Date(2023, 4, 0);

    for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(date.getDate() + i + firstDay);
        days.push(weekdayNameShort(date));
    }

    return days;
};

type FirstDay = 1 | 7;

type WeekInfo = {
    firstDay: FirstDay;
    minimalDays: number;
    weekend: [number, number];
};

/**
 * Returns an integer indicating the first day of the week
 * for the locale. Can be either 1 (Monday) or 7 (Sunday).
 * @returns The first day of the week.
 */
export const getFirstDayOfWeek = (): FirstDay => {
    const fallback: WeekInfo = { firstDay: 7, minimalDays: 1, weekend: [6, 7] };
    const locale = new Intl.Locale(defaults.locale);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
    const weekInfo: WeekInfo =
        // @ts-expect-error - TS doesn't know about weekInfo
        locale.weekInfo ||
        // @ts-expect-error - TS doesn't know about weekInfo
        (locale.getWeekInfo && locale.getWeekInfo()) ||
        fallback;

    return weekInfo.firstDay;
};

/**
 * Pads the start of a string with a specified character until it reaches a specified length.
 * @param str The string to pad.
 * @param length The desired length of the padded string.
 * @param pad The character used for padding.
 * @returns The padded string.
 */
export const padStart = (str: string, length: number, pad: string) => {
    while (str.length < length) {
        str = pad + str;
    }

    return str;
};
