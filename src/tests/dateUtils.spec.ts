import {
    addMonths,
    addYears,
    getDaysInMonth,
    getMonthFirstDay,
    getToday,
    isDate,
    isSameDay,
    isSameMonth,
    isToday,
    setDate,
    setMonth,
    setYear,
} from "../dateUtils";

describe("dateUtils", () => {
    describe("isDate()", () => {
        it("should return true if the argument is a Date", () => {
            expect(isDate(new Date())).toBe(true);
        });

        it("should return false if the argument is not a Date", () => {
            expect(isDate("not a date")).toBe(false);
        });
    });

    describe("isSameDay()", () => {
        it("should return true if the dates are the same day", () => {
            const date1 = new Date(2020, 1, 1);
            const date2 = new Date(2020, 1, 1);
            expect(isSameDay(date1, date2)).toBe(true);
        });

        it("should return false if the dates are not the same day", () => {
            const date1 = new Date(2020, 1, 1);
            const date2 = new Date(2020, 1, 2);
            expect(isSameDay(date1, date2)).toBe(false);
        });
    });

    describe("isToday()", () => {
        it("should return true if the date is today", () => {
            expect(isToday(new Date())).toBe(true);
        });

        it("should return false if the date is not today", () => {
            expect(isToday(new Date(2020, 1, 1))).toBe(false);
        });
    });

    describe("isSameMonth()", () => {
        it("should return true if the dates are in the same month", () => {
            const date1 = new Date(2020, 1, 1);
            const date2 = new Date(2020, 1, 2);
            expect(isSameMonth(date1, date2)).toBe(true);
        });

        it("should return false if the dates are not in the same month", () => {
            const date1 = new Date(2020, 1, 1);
            const date2 = new Date(2020, 2, 1);
            expect(isSameMonth(date1, date2)).toBe(false);
        });
    });

    describe("addMonths()", () => {
        it("should add the specified number of months to a date", () => {
            const date = new Date(2020, 1, 1);
            const newDate = addMonths(date, 1);
            expect(newDate).toEqual(new Date(2020, 2, 1));
        });
    });

    describe("addYears()", () => {
        it("should add the specified number of years to a date", () => {
            const date = new Date(2020, 1, 1);
            const newDate = addYears(date, 1);
            expect(newDate).toEqual(new Date(2021, 1, 1));
        });
    });

    describe("getToday()", () => {
        it("should return today's date", () => {
            const today = getToday();
            expect(isToday(today)).toBe(true);
            expect(today.getHours()).toBe(0);
            expect(today.getMinutes()).toBe(0);
            expect(today.getSeconds()).toBe(0);
            expect(today.getMilliseconds()).toBe(0);
        });
    });

    describe("getDaysInMonth()", () => {
        it("should return the number of days in a month", () => {
            const date = new Date(2020, 1, 1);
            expect(getDaysInMonth(date)).toBe(29);
        });
    });

    describe("getMonthFirstDay()", () => {
        it("should return the first day of the month", () => {
            const date = new Date(2020, 1, 1);
            expect(getMonthFirstDay(date)).toBe(6);
        });
    });

    describe("setYear()", () => {
        it("should set the year of a date", () => {
            const date = new Date(2020, 1, 1);
            const newDate = setYear(date, 2021);
            expect(newDate).toEqual(new Date(2021, 1, 1));
        });
    });

    describe("setMonth()", () => {
        it("should set the month of a date", () => {
            const date = new Date(2020, 1, 1);
            const newDate = setMonth(date, 2);
            expect(newDate).toEqual(new Date(2020, 2, 1));
        });
    });

    describe("setDate()", () => {
        it("should set the day of a date", () => {
            const date = new Date(2020, 1, 1);
            const newDate = setDate(date, 2);
            expect(newDate).toEqual(new Date(2020, 1, 2));
        });
    });
});
