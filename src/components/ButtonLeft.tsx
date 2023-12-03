import { IconButton } from "@suid/material";
import ChevronLeftIcon from "@suid/icons-material/ChevronLeft";

type ButtonLeftProps = {
    onClick: () => void;
};

export default function ButtonLeft(props: ButtonLeftProps) {
    return (
        <IconButton onClick={props.onClick} size="small">
            <ChevronLeftIcon />
        </IconButton>
    );
}
