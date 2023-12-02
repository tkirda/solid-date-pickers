import type { Meta, StoryObj } from "storybook-solidjs";

import DateField from "../DateField";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
    title: "DateField",
    component: DateField,
    tags: ["autodocs"],
    argTypes: {
        // backgroundColor: { control: "color" },
    },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const Primary: Story = {
    args: {
        format: "YYYY-MM-DD hh:mm AM",
        label: "Date Input Field",
    },
};
