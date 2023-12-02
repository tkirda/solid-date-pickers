/**
 * Checks if the given value is a valid Date object.
 * @param date - The value to check.
 * @returns True if the value is a valid Date object, false otherwise.
 */
export const isDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Checks if two dates are the same day.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if the dates are the same day, false otherwise.
 */
export const isSameDay = (date1: Date, date2: Date) => {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

/**
 * Checks if a date is today.
 * @param date - The date to check.
 * @returns True if the date is today, false otherwise.
 */
export const isToday = (date: Date) => {
    return isSameDay(date, new Date());
};

/**
 * Checks if two dates are in the same month.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if the dates are in the same month, false otherwise.
 */
export const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

/**
 * Adds the specified number of months to a date.
 * @param date - The date to add months to.
 * @param n - The number of months to add.
 * @returns The new date after adding the months.
 */
export const addMonths = (date: Date, n: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + n);
    return d;
};

/**
 * Adds the specified number of years to a date.
 * @param date - The date to add years to.
 * @param n - The number of years to add.
 * @returns The new date after adding the years.
 */
export const addYears = (date: Date, n: number) => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + n);
    return d;
};

/**
 * Gets today's date without the time component.
 * @returns Today's date.
 */
export const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Gets the number of days in a month.
 * @param date - The date representing the month.
 * @returns The number of days in the month.
 */
export const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Gets starting day of the week for a given month.
 * @param date - The date.
 * @returns The day of the week (0-6, where 0 is Sunday).
 */
export const getMonthFirstDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

/**
 * Sets the year of a given date.
 * @param date - The date to modify.
 * @param year - The year to set.
 * @returns A new Date object with the modified year.
 */
export const setYear = (date: Date, year: number) => {
    const d = new Date(date);
    d.setFullYear(year);
    return d;
}

/**
 * Sets the month of a given date.
 * 
 * @param date - The date to modify.
 * @param month - The month to set (0-11).
 * @returns A new Date object with the modified month.
 */
export const setMonth = (date: Date, month: number) => {
    const d = new Date(date);
    d.setMonth(month);
    return d;
};


/**
 * Sets the day of a given date.
 * 
 * @param date - The date to modify.
 * @param day - The day to set.
 * @returns A new Date object with the modified day.
 */
export const setDate = (date: Date, day: number) => {
    const d = new Date(date);
    d.setDate(day);
    return d;
};
