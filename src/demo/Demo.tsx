import { createMemo, createSignal } from "solid-js";
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    ThemeProvider,
    Typography,
    createPalette,
    createTheme,
} from "@suid/material";
import LightModeIcon from "@suid/icons-material/LightMode";
import DarkModeIcon from "@suid/icons-material/DarkMode";
import DateField from "../DateField";
import DateCalendar from "../DateCalendar";
import DateRangeCalendar from "../DateRangeCalendar";
import { DateRange } from "../models";
import Code from "./Code";
import DateFormat from "../format/DateFormat";

export default function Demo() {
    const [date, setDate] = createSignal<Date | null>(null);
    const [range1, setRange1] = createSignal<DateRange>([null, null]);
    const [range2, setRange2] = createSignal<DateRange>([null, null]);
    const [mode, setMode] = createSignal<"dark" | "light">("dark");
    const [locale, setLocale] = createSignal("en-US");
    const shortDateFormat = createMemo(() => new DateFormat(locale()).getShortDateFormat());

    const palette = createMemo(() => createPalette({ mode: mode() }));

    const theme = createTheme({ palette: palette });

    const toggleDarkMode = () => {
        setMode((current) => (current === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Box padding={1}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item flexGrow={1}>
                        <Typography variant="h5">SolidJS Date Picker</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={toggleDarkMode}>
                            {mode() === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Box maxWidth={800} margin="0 auto" padding={2}>
                <h2>Overview</h2>
                <p>
                    This is a collection of date picker components for SolidJS. Similar to{" "}
                    <a href="https://mui.com/x/react-date-pickers/" target="_blank">
                        MUI Date Pickers
                    </a>
                    .
                </p>
                <p>
                    The package is built on top of SUID UI library. It requires following peer
                    dependencies:{" "}
                    <a href="https://suid.io/" target="_blank">
                        @suid/material
                    </a>{" "}
                    and{" "}
                    <a href="https://suid.io/components/material-icons" target="_blank">
                        @suid/icons-material
                    </a>
                    .
                </p>

                <h2>Date Field</h2>
                <p>The Date Field component lets users select a date with the keyboard.</p>
                <DateField
                    label="Date Field"
                    value={date()}
                    onChange={setDate}
                    format={shortDateFormat()}
                />

                <p>With custom date format:</p>
                <DateField
                    label="Format: YYYY-MM-DD HH:mm"
                    format="YYYY-MM-DD HH:mm"
                    value={date()}
                    onChange={setDate}
                />
                <br />
                <br />

                <Code source={dateFieldSample} />

                <h2>Date Calendar</h2>
                <DateCalendar value={date()} onChange={setDate} locale={locale()} />

                <Code source={dateCalendarSample} />

                <h2>Date Range Calendar</h2>
                <DateRangeCalendar
                    calendars={3}
                    locale={locale()}
                    onChange={setRange1}
                    value={range1()}
                />
                <br />
                <Button
                    variant="outlined"
                    disabled={range1().every((v) => !v)}
                    onClick={() => setRange1([null, null])}
                >
                    Clear
                </Button>

                <Code source={dateRangeCalendarSample} />

                <h2>Date Range Calendar with Inputs (sample)</h2>
                <Stack direction="row" spacing={2}>
                    <DateField
                        format={shortDateFormat()}
                        label="Date Start"
                        onChange={(d) => setRange2([d, range1()[1]])}
                        value={range2()[0]}
                    />
                    <DateField
                        format={shortDateFormat()}
                        label="Date End"
                        onChange={(d) => setRange2([range1()[0], d])}
                        value={range2()[1]}
                    />
                </Stack>
                <br />
                <DateRangeCalendar
                    calendars={2}
                    locale={locale()}
                    onChange={setRange2}
                    value={range2()}
                />
                <br />
                <Button
                    variant="outlined"
                    disabled={range2().every((v) => !v)}
                    onClick={() => setRange2([null, null])}
                >
                    Clear
                </Button>

                <h2>Localization</h2>

                <p>
                    Specify your preferred locale to view labels in a localized format. Components
                    leverage the Intl.DateTimeFormat to format dates according to your selected
                    regional standard. To experience the localization feature firsthand, choose a
                    different locale from the dropdown menu below. Please note that this is just a
                    sample of the locales; the full range of available options depends on your
                    browser's capabilities.
                </p>

                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel id="locale-label">Locale</InputLabel>
                    <Select
                        labelId="locale-label"
                        label="Locale"
                        value={locale()}
                        onChange={(e) => setLocale(e.target.value)}
                    >
                        <MenuItem value="de-DE">German (de-DE)</MenuItem>
                        <MenuItem value="en-GB">English (en-GB)</MenuItem>
                        <MenuItem value="en-US">English (en-US)</MenuItem>
                        <MenuItem value="es-ES">Spanish (es-ES)</MenuItem>
                        <MenuItem value="fr-FR">French (fr-FR)</MenuItem>
                        <MenuItem value="ja-JP">Japanese (ja-JP)</MenuItem>
                        <MenuItem value="lt-LT">Lithuanian (lt-LT)</MenuItem>
                        <MenuItem value="pt-BR">Portuguese (pt-BR)</MenuItem>
                        <MenuItem value="ru-RU">Russian (ru-RU)</MenuItem>
                        <MenuItem value="zh-CN">Chinese (zh-CN)</MenuItem>
                    </Select>
                </FormControl>
                <br />
                <br />
            </Box>
        </ThemeProvider>
    );
}

const dateCalendarSample = `
import { DateCalendar } from "solid-date-pickers";

<DateCalendar value={date()} onChange={setDate} />
`;

const dateRangeCalendarSample = `
import { DateRangeCalendar } from "solid-date-pickers";

<DateRangeCalendar value={range()} calendars={3} onChange={setRange} />
`;

const dateFieldSample = `
import { DateField } from "solid-date-pickers";

<DateField label="Date Field" value={date()} onChange={setDate} />
`;
