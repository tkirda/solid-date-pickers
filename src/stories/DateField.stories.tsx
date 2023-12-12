import type { Meta, StoryObj } from "storybook-solidjs";
import DateField from "../DateField";

const meta = {
    title: "DateField",
    component: DateField,
    tags: ["autodocs"],
    argTypes: {},
} satisfies Meta<typeof DateField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        format: "YYYY-MM-DD hh:mm AM",
        label: "Date Input Field",
    },
};
