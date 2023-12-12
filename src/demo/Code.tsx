/* eslint-disable solid/no-innerhtml */
import { Show, createMemo, createSignal } from "solid-js";
import { Box, Button, Paper } from "@suid/material";
import CodeIcon from "@suid/icons-material/Code";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-tomorrow.css";

type CodeProps = {
    source: string;
};

export default function Code(props: CodeProps) {
    const code = createMemo(() =>
        Prism.highlight(
            props.source.trim().replace("../index", "solid-date-pickers"),
            Prism.languages["tsx"],
            "tsx",
        ),
    );

    const [showCode, setShowCode] = createSignal(false);
    const toggleSource = () => setShowCode((current) => !current);

    return (
        <Box padding="10px 0">
            <Box marginBottom={1}>
                <Button onClick={toggleSource} size="small" startIcon={<CodeIcon />}>
                    Code
                </Button>
            </Box>
            <Show when={showCode()}>
                <Paper square variant="outlined">
                    <Box
                        backgroundColor="#121212"
                        color="#FFF"
                        component="pre"
                        margin={0}
                        padding={1}
                    >
                        <Box component="code" innerHTML={code()} />
                    </Box>
                </Paper>
            </Show>
        </Box>
    );
}
