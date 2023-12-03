import { IconButton } from "@suid/material";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";

type ButtonRightProps = {
    onClick: () => void;
};

export default function ButtonRight(props: ButtonRightProps) {
    return (
        <IconButton onClick={props.onClick} size="small">
            <ChevronRightIcon />
        </IconButton>
    );
}
