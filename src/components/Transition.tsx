import { Show, createEffect, createSignal } from "solid-js";
import { Box } from "@suid/material";

export type TransitionDirection = "prev" | "next" | "none";

type TransitionProps = {
    children: any;
    onTransitionEnd: () => void;
    transitionTo: any;
    transitionDirection: TransitionDirection;
    width: number;
};

export default function Transition(props: TransitionProps) {
    const [transitionInProgress, setTransitionInProgress] = createSignal(false);

    // eslint-disable-next-line solid/reactivity
    const width = props.width;

    const [x, setX] = createSignal(-width);

    const handleTransitionEnd = () => {
        setTransitionInProgress(false);
        setX(-width);
        props.onTransitionEnd();
    };

    createEffect(() => {
        const td = props.transitionDirection;

        if (td === "none") {
            return;
        }

        setTransitionInProgress(true);

        const x = td === "next" ? -(width * 2) : td === "prev" ? 0 : -width;

        // Use a timeout to allow the transition to take place
        setTimeout(() => setX(x));
    });

    return (
        <Show when={transitionInProgress()} fallback={props.children}>
            <Box sx={{ overflow: "hidden" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: width * 3,
                        transform: `translateX(${x()}px)`,
                        transition: "transform 0.3s ease-in-out",
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    <Box width={width}>
                        {props.transitionDirection === "prev" && props.transitionTo}
                    </Box>
                    <Box width={width}>{props.children}</Box>
                    <Box width={width}>
                        {props.transitionDirection === "next" && props.transitionTo}
                    </Box>
                </Box>
            </Box>
        </Show>
    );
}
