import { createMemo, createSignal } from "solid-js";
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    Grid,
    IconButton,
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

export default function Demo() {
    const [date, setDate] = createSignal<Date | null>(null);
    const [range, setRange] = createSignal<DateRange>([null, null]);
    const [mode, setMode] = createSignal<"dark" | "light">("dark");

    const palette = createMemo(() =>
        createPalette(mode() === "dark" ? { mode: "dark" } : { mode: "light" }),
    );

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
                    {"This is a collection of date picker components for SolidJS. Similar to "}
                    <a href="https://mui.com/x/react-date-pickers/" target="_blank">
                        MUI Date Pickers
                    </a>
                    .
                </p>
                <p>
                    {"The package is built on top of SUID UI library. It requires following peer dependencies: "}
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
                <p>The Date Field component lets users select a date with the keyboard.</p>
                <DateField label="Date Field" value={date()} onChange={setDate} />
                <p>With custom date format:</p>
                <DateField
                    label="Format: YYYY-MM-DD HH:mm"
                    format="YYYY-MM-DD HH:mm"
                    value={date()}
                    onChange={setDate}
                />

                <h2>Date Calendar</h2>
                <DateCalendar value={date()} onChange={setDate} />

                <h2>Date Range Calendar</h2>
                <Stack direction="row" spacing={2}>
                    <DateField
                        label="Date Start"
                        value={range()[0]}
                        onChange={(d) => setRange([d, range()[1]])}
                    />
                    <DateField
                        label="Date End"
                        value={range()[1]}
                        onChange={(d) => setRange([range()[0], d])}
                    />
                </Stack>
                <br />
                <DateRangeCalendar value={range()} calendars={2} onChange={setRange} />
                <br />
                <Button
                    variant="outlined"
                    disabled={range().every((v) => !v)}
                    onClick={() => setRange([null, null])}
                >
                    Clear
                </Button>
            </Box>
        </ThemeProvider>
    );
}
