type FirstDay = 1 | 7;

type WeekInfo = {
    firstDay: FirstDay;
    minimalDays: number;
    weekend: [number, number];
};

type Weekday = {
    /**
     * Short weekday name
     */
    short: string;
    /**
     * Long weekday name
     */
    long: string;
    /**
     * Sunday - Saturday: 0 - 6
     */
    day: number;
};

export default class DateFormat {
    constructor(private locale: string) {}

    private getFormat(options: Intl.DateTimeFormatOptions) {
        return new Intl.DateTimeFormat(this.locale, options);
    }

    public monthNameLong(date: Date) {
        return this.getFormat({ month: "long" }).format(date);
    }

    public monthNameShort(date: Date) {
        return this.getFormat({ month: "short" }).format(date);
    }

    public monthAndYear(date: Date) {
        return this.getFormat({ month: "long", year: "numeric" }).format(date);
    }

    public getFirstDayOfWeek() {
        const fallback: WeekInfo = { firstDay: 7, minimalDays: 1, weekend: [6, 7] };
        const locale = new Intl.Locale(this.locale);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
        const weekInfo: WeekInfo =
            // @ts-expect-error - TS doesn't know about weekInfo
            locale.weekInfo ||
            // @ts-expect-error - TS doesn't know about weekInfo
            (locale.getWeekInfo && locale.getWeekInfo()) ||
            fallback;

        return weekInfo.firstDay;
    }

    /**
     * Returns an array of weekdays, starting with the first day of the week.
     */
    public getWeekdays() {
        const days: Weekday[] = [];
        const sunday = new Date(2023, 4, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(sunday);
            date.setDate(date.getDate() + i + this.getFirstDayOfWeek());
            days.push({
                long: this.weekdayNameLong(date),
                short: this.weekdayNameShort(date),
                day: date.getDay(),
            });
        }

        return days;
    }

    public weekdayNameShort(date: Date) {
        return this.getFormat({ weekday: "short" }).format(date);
    }

    public weekdayNameLong(date: Date) {
        return this.getFormat({ weekday: "long" }).format(date);
    }

    public getShortDateFormat() {
        const date = new Date(2023, 3, 15);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        const formattedDate = this.getFormat(options).format(date);

        return formattedDate.replace(/2023/, "YYYY").replace(/04/, "MM").replace(/15/, "DD");
    }
}
