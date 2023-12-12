import { createMemo, createSignal } from "solid-js";
import {
    Box,
    CssBaseline,
    Grid,
    IconButton,
    ThemeProvider,
    createPalette,
    createTheme,
} from "@suid/material";
import LightModeIcon from "@suid/icons-material/LightMode";
import DarkModeIcon from "@suid/icons-material/DarkMode";
import Code from "./Code";
import GitHubIcon from "./GitHubIcon";
import "./Demo.css";
import DateCalendarDemo from "./DateCalendarDemo";
import DateFieldDemo from "./DateFieldDemo";
import DateRangeCalendarDemo from "./DateRangeCalendarDemo";
import { setDefaultLocale } from "../locale";
import DateRangeWithInputsDemo from "./DateRangeWithInputsDemo";
import SetDefaultLocale from "./SetDefaultLocale";

// @ts-expect-error: source code
import DateCalendarDemoSource from "./DateCalendarDemo?raw";
// @ts-expect-error: source code
import DateFieldDemoSource from "./DateFieldDemo?raw";
// @ts-expect-error: source code
import DateRangeCalendarDemoSource from "./DateRangeCalendarDemo?raw";
// @ts-expect-error: source code
import DateRangeWithInputsDemoSource from "./DateRangeWithInputsDemo?raw";
// @ts-expect-error: source code
import SetDefaultLocaleSource from "./SetDefaultLocale?raw";

setDefaultLocale("en-US");

export default function Demo() {
    const [mode, setMode] = createSignal<"dark" | "light">("dark");
    const darkMode = createMemo(() => mode() === "dark");

    const palette = createMemo(() =>
        createPalette(
            darkMode() ? { mode: mode(), background: { default: "#0D1117" } } : { mode: mode() },
        ),
    );

    const theme = createTheme({ palette: palette });

    const toggleDarkMode = () => {
        setMode((current) => (current === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Box padding={1} backgroundColor={darkMode() ? "#010409" : "#EEE"} class="header">
                <Grid container spacing={2} alignItems="center">
                    <Grid item flexGrow={1}>
                        <h1 class={"header-text"}>
                            SolidJS <span class="gradient-text">Date Picker</span>
                        </h1>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={toggleDarkMode}>
                            {darkMode() ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton
                            component="a"
                            href="https://github.com/tkirda/solid-date-pickers"
                            target="_blank"
                        >
                            <GitHubIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Box padding={2} margin="50px auto" maxWidth="850px">
                <h2>Overview</h2>
                <p>
                    {"This is a collection of date picker components for SolidJS. Similar to "}
                    <a href="https://mui.com/x/react-date-pickers/" target="_blank">
                        MUI Date Pickers
                    </a>
                    {
                        ". The package is built on top of SUID UI library. It requires following peer dependencies: "
                    }
                    <a href="https://suid.io/" target="_blank">
                        @suid/material
                    </a>
                    {" and "}
                    <a href="https://suid.io/components/material-icons" target="_blank">
                        @suid/icons-material
                    </a>
                    .
                </p>

                <h2>Date Field</h2>
                <p>The DateField component lets users select a date with the keyboard.</p>
                <DateFieldDemo />
                <Code source={DateFieldDemoSource} />

                <h2>Date Calendar</h2>
                <p>The DateCalendar component lets users select a date from a calendar.</p>
                <DateCalendarDemo />
                <Code source={DateCalendarDemoSource} />

                <h2>Date Range Calendar</h2>
                <p>
                    The DateRangeCalendar component lets users select a date range from a calendar.
                </p>
                <DateRangeCalendarDemo />
                <Code source={DateRangeCalendarDemoSource} />

                <h2>Localization</h2>
                <p>
                    Specify your preferred locale to view labels in a localized format. Components
                    leverage the Intl.DateTimeFormat to format dates according to your selected
                    regional standard. To experience the localization feature firsthand, choose a
                    different locale from the dropdown menu below. Please note that this is just a
                    sample of the locales; the full range of available options depends on your
                    browser's capabilities.
                </p>
                <SetDefaultLocale />
                <Code source={SetDefaultLocaleSource} />

                <h2>Samples</h2>
                <h3>Date Range Calendar with Inputs </h3>
                <DateRangeWithInputsDemo />
                <Code source={DateRangeWithInputsDemoSource} />
            </Box>
        </ThemeProvider>
    );
}
