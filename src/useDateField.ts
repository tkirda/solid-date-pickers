import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { getToday, isDate } from "./dateUtils";
import { padStart } from "./format/stringFormat";

type FragmentKey = "MM" | "DD" | "YYYY" | "HH" | "hh" | "mm" | "ss" | "SSS" | "AM";

type Definition = {
    maxValue: number;
    minValue: number;
    initialValue?: number;
};

type Fragment = {
    key: FragmentKey;
    start: number;
    end: number;
} & Definition;

const definitions: Record<FragmentKey, Definition> = {
    MM: { maxValue: 12, minValue: 1 },
    DD: { maxValue: 31, minValue: 1 },
    YYYY: { maxValue: 9999, minValue: 0, initialValue: new Date().getFullYear() },
    HH: { maxValue: 23, minValue: 0 },
    hh: { maxValue: 12, minValue: 1 },
    mm: { maxValue: 59, minValue: 0 },
    ss: { maxValue: 59, minValue: 0 },
    SSS: { maxValue: 999, minValue: 0 },
    AM: { maxValue: 0, minValue: 0 },
};

type DateFieldProps = {
    value?: Date | null;
    format?: string;
    onChange?: (date: Date | null) => void;
};

/**
 * Regular expression used to match fragments in the input string.
 * Fragments are defined by the keys of the `definitions` object.
 */
const fragmentsRegEx = new RegExp(`(${Object.keys(definitions).join("|")})`, "g");

const parseFragments = (pattern: string) => {
    const fragments: Fragment[] = [];

    let match: RegExpExecArray | null;

    while ((match = fragmentsRegEx.exec(pattern)) !== null) {
        const value = match[0] as FragmentKey;
        const definition = definitions[value];

        fragments.push({
            start: match.index,
            end: match.index + value.length,
            key: value,
            ...definition,
        });
    }

    return fragments;
};

const defaultFormat = "MM/DD/YYYY";

const normalizeAmPm = (hours: number) => (hours === 0 || hours === 12 ? 12 : hours % 12);

const toInt = (value: string) => parseInt(value, 10);

/**
 * Custom hook for managing a date field.
 * @param props - The props for the date field.
 * @returns An object containing various functions and values for managing the date field.
 */
export default function useDateField(props: DateFieldProps) {
    const [error, setError] = createSignal(false);
    const [fragments, setFragments] = createSignal<Fragment[]>([]);
    const format = createMemo(() => props.format || defaultFormat);

    let input: HTMLInputElement;

    createEffect(() => {
        const value = props.value;
        const f = format();

        setFragments(parseFragments(f));

        if (!input) {
            throw new Error("Input element has not been set. Make sure to use the inputRef.");
        }

        if (isDate(value)) {
            const fmt = (value: number, length = 2) => padStart(String(value), length, "0");
            const hours = value.getHours();

            const formatted = f
                .replace("MM", fmt(value.getMonth() + 1))
                .replace("DD", fmt(value.getDate()))
                .replace("YYYY", fmt(value.getFullYear(), 4))
                .replace("HH", fmt(hours))
                .replace("hh", fmt(normalizeAmPm(hours)))
                .replace("mm", fmt(value.getMinutes()))
                .replace("ss", fmt(value.getSeconds()))
                .replace("SSS", fmt(value.getMilliseconds(), 3))
                .replace("AM", hours < 12 ? "AM" : "PM");

            if (input.value !== formatted) {
                const fragment = getCurrentFragment();
                input.value = formatted;
                selectFragment(fragment);
            }
        } else {
            if (!input.value) {
                input.value = f;
            }
        }
    });

    const isLastFragment = () => {
        const index = getCurrentFragmentIndex();
        return index === fragments().length - 1;
    };

    const getCurrentFragmentIndex = () => {
        const selectionStart = input.selectionStart || 0;
        const lastIndex = fragments().findLastIndex((f) => f.start <= selectionStart);

        return lastIndex === -1 ? 0 : lastIndex;
    };

    const getCurrentFragment = () => fragments()[getCurrentFragmentIndex()];

    const getValue = (fragment: Fragment | null | undefined) =>
        fragment ? input.value.substring(fragment.start, fragment.end) : "";

    const getValueByKey = (key: FragmentKey) => getValue(fragments().find((f) => f.key === key));

    const selectFirstFragment = () => {
        selectFragment(fragments()[0]);
    };

    const selectLastFragment = () => {
        selectFragment(fragments()[fragments().length - 1]);
    };

    const selectFragment = (fragment: Fragment | null | undefined) => {
        if (!fragment) return;
        input.setSelectionRange(fragment.start, fragment.end);
    };

    const selectNextFragment = () => {
        const index = getCurrentFragmentIndex();
        const nextIndex = index === fragments().length - 1 ? 0 : index + 1;
        const fragment = fragments()[nextIndex];
        selectFragment(fragment);
    };

    const selectPreviousFragment = () => {
        const index = getCurrentFragmentIndex();
        const previousIndex = index === 0 ? fragments().length - 1 : index - 1;
        const fragment = fragments()[previousIndex];
        selectFragment(fragment);
    };

    const setValue = (fragment: Fragment, value: number | string) => {
        input.setRangeText(
            padStart(String(value), fragment.key.length, "0"),
            fragment.start,
            fragment.end,
        );

        input.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const toggleAmPm = (fragment: Fragment) => {
        const value = input.value.substring(fragment.start, fragment.end);
        setValue(fragment, value === "AM" ? "PM" : "AM");
    };

    const getMaxValue = (fragment: Fragment) => {
        if (fragment.key === "DD") {
            const yearValue = getValueByKey("YYYY");
            const monthValue = getValueByKey("MM");

            if (isNumeric(yearValue) && isNumeric(monthValue)) {
                // Get number of days in the month
                return new Date(toInt(monthValue), toInt(monthValue), 0).getDate();
            }
        }

        return fragment.maxValue;
    };

    const valueUp = (fragment: Fragment) => {
        if (fragment.key === "AM") {
            toggleAmPm(fragment);
            return;
        }

        const maxValue = getMaxValue(fragment);
        const value = getValue(fragment);
        const number = isNumeric(value) ? toInt(value) : 0;

        if (number === 0 && fragment.initialValue != null) {
            setValue(fragment, fragment.initialValue);
            return;
        }

        const nextValue = number === maxValue ? fragment.minValue : number + 1;

        setValue(fragment, nextValue);
    };

    const valueDown = (fragment: Fragment) => {
        if (fragment.key === "AM") {
            toggleAmPm(fragment);
            return;
        }

        const maxValue = getMaxValue(fragment);
        const value = getValue(fragment);
        const number = isNumeric(value) ? toInt(value) : fragment.minValue ?? 0;

        if (number === 0 && fragment.initialValue != null) {
            setValue(fragment, fragment.initialValue);
            return;
        }

        const nextValue = fragment.minValue === number ? maxValue : number - 1;

        setValue(fragment, nextValue);
    };

    const currentYear = () => new Date().getFullYear();

    const valueMin = (fragment: Fragment) => {
        if (fragment.key === "AM") {
            setValue(fragment, "AM");
            return;
        }

        setValue(fragment, fragment.key === "YYYY" ? currentYear() : fragment.minValue);
        selectNextFragment();
    };

    const valueMax = (fragment: Fragment) => {
        if (fragment.key === "AM") {
            setValue(fragment, "PM");
            return;
        }

        setValue(fragment, fragment.key === "YYYY" ? currentYear() : fragment.maxValue);
        selectNextFragment();
    };

    const isNumeric = (value: string) => /^\d+$/.test(value);

    const valueIn = (fragment: Fragment, digit: number) => {
        if (fragment.key === "AM") {
            return;
        }

        const value = input.value.substring(fragment.start, fragment.end);
        const nonDigit = /\D/;
        const position = value.search(nonDigit);

        const next =
            position === -1
                ? `${digit}${fragment.key.substring(1)}`
                : `${value.substring(0, position)}${digit}${value.substring(position + 1)}`;

        // Prevent user from entering a value greater than the max value
        if (isNumeric(next) && toInt(next) > fragment.maxValue) {
            return;
        }

        setValue(fragment, next);

        if (isNumeric(next) && !isLastFragment()) {
            selectNextFragment();
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") return;

        e.preventDefault();

        const fragment = getCurrentFragment();

        if (!fragment) {
            selectFirstFragment();
            return;
        }

        if (isNumeric(e.key)) {
            valueIn(fragment, toInt(e.key));
            return;
        }

        if (fragment.key === "AM") {
            switch (e.key) {
                case "a":
                case "A":
                    setValue(fragment, "AM");
                    break;

                case "p":
                case "P":
                    setValue(fragment, "PM");
                    break;
            }
        }

        switch (e.key) {
            case "Home":
                selectFirstFragment();
                break;

            case "End":
                selectLastFragment();
                break;

            case "PageUp":
                valueMax(fragment);
                break;

            case "PageDown":
                valueMin(fragment);
                break;

            case "Backspace":
                if (getValue(fragment) === fragment.key) {
                    const index = getCurrentFragmentIndex();
                    const prevFragment = fragments()[index - 1];

                    if (prevFragment) {
                        setValue(prevFragment, prevFragment.key);
                        selectFragment(prevFragment);
                    }
                }

                setValue(fragment, fragment.key);
                break;

            case "Delete":
                if (getValue(fragment) === fragment.key) {
                    const index = getCurrentFragmentIndex();
                    const nextFragment = fragments()[index + 1];

                    if (nextFragment) {
                        setValue(nextFragment, nextFragment.key);
                        selectFragment(nextFragment);
                    }
                }

                setValue(fragment, fragment.key);
                break;

            case "ArrowLeft":
                selectPreviousFragment();
                break;

            case "ArrowRight":
                selectNextFragment();
                break;

            case "ArrowUp":
                valueUp(fragment);
                break;

            case "ArrowDown":
                valueDown(fragment);
                break;
        }
    };

    const onFocus = () => {
        if (input.value === "") {
            input.value = format();
        }

        selectFirstFragment();
    };

    const onBlur = () => {
        if (input.value === format()) {
            input.value = "";
            setError(false);
        }
    };

    const onMouseUp = () => {
        selectFragment(getCurrentFragment());
    };

    const getDate = () => {
        // Every fragment (except AM) must be numeric or the date is invalid
        if (!fragments().every((f) => isNumeric(getValue(f)) || f.key === "AM")) {
            return null;
        }

        // Get the value of the fragment or value from the base date
        const fragmentValue = (key: FragmentKey) => {
            const fragment = fragments().find((f) => f.key === key);
            const base = props.value || getToday();

            if (fragment) {
                return toInt(getValue(fragment)) || 0;
            }

            // Preserve the current value if the fragment is not found
            switch (key) {
                case "MM":
                    return base.getMonth() + 1;
                case "DD":
                    return base.getDate();
                case "YYYY":
                    return base.getFullYear();
                case "HH":
                    return base.getHours();
                case "hh":
                    return normalizeAmPm(base.getHours());
                case "mm":
                    return base.getMinutes();
                case "ss":
                    return base.getSeconds();
                case "SSS":
                    return base.getMilliseconds();
                default:
                    return 0;
            }
        };

        const getHours = () => {
            const amFragment = fragments().find((f) => f.key === "AM");

            if (amFragment) {
                const hours = fragmentValue("hh");
                const isAM = getValue(amFragment) === "AM";
                const isPM = !isAM;

                // 12:00 AM is 00:00 hours
                if (isAM && hours === 12) {
                    return 0;
                }

                if (isPM && hours < 12) {
                    return hours + 12;
                }

                return hours;
            }

            return fragmentValue("HH");
        };

        const values = {
            year: fragmentValue("YYYY"),
            monthIndex: fragmentValue("MM") - 1,
            day: fragmentValue("DD"),
            hours: getHours(),
            minutes: fragmentValue("mm"),
            seconds: fragmentValue("ss"),
            millisecons: fragmentValue("SSS"),
        };

        return new Date(
            values.year,
            values.monthIndex,
            values.day,
            values.hours,
            values.minutes,
            values.seconds,
            values.millisecons,
        );
    };

    const onPaste = (e: ClipboardEvent) => {
        e.preventDefault();
    };

    const onChange = () => {
        const fmt = format();

        if (input.value === fmt) {
            setError(false);
            if (props.value) {
                props.onChange?.(null);
            }
            return;
        }

        const date = getDate();

        setError(!date);

        if (date !== props.value) {
            props.onChange?.(date);
        }
    };

    const onDragStart = (e: Event) => {
        e.preventDefault();
    };

    const eventHandlers = new Map<string, (e: any) => void>([
        ["blur", onBlur],
        ["change", onChange],
        ["dragstart", onDragStart],
        ["focus", onFocus],
        ["keydown", onKeyDown],
        ["mouseup", onMouseUp],
        ["paste", onPaste],
    ]);

    const inputRef = (el: HTMLInputElement) => {
        input = el;

        if (!input) return;

        for (const [name, handler] of eventHandlers.entries()) {
            input.addEventListener(name, handler);
        }
    };

    onCleanup(() => {
        if (!input) return;

        for (const [name, handler] of eventHandlers.entries()) {
            input.removeEventListener(name, handler);
        }
    });

    return {
        inputRef,
        error,
    };
}
