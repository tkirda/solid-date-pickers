import { createMemo } from "solid-js";
import { Box, Paper, useTheme } from "@suid/material";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";

type CodeProps = {
    source: string;
};

export default function Code(props: CodeProps) {
    const theme = useTheme();

    const themeClassName = () =>
        theme.palette.mode === "dark" ? "prism-vsc-dark-plus" : "prism-material-light";

    const code = createMemo(() => Prism.highlight(props.source.trim(), Prism.languages["tsx"], "tsx"));

    return (
        <Paper variant="outlined" sx={{ margin: "20px 0" }}>
            <Box component="pre" padding={2} margin={0}>
                <Box margin={0} class={themeClassName()} component="code" innerHTML={code()} />
            </Box>
        </Paper>
    );
}
