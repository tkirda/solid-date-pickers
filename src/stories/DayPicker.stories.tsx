import type { Meta, StoryObj } from "storybook-solidjs";

import DateCalendar, { DayPickerProps } from "../DateCalendar";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
    title: "DayPicker",
    component: DateCalendar,
    tags: ["autodocs"],
    argTypes: {
        onChange: { action: "onChange" },
    },
} satisfies Meta<typeof DateCalendar>;

export default meta;

type Story = StoryObj<typeof DateCalendar>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/solid/writing-stories/args
export const Primary: Story = {
    args: {
        value: new Date(),
        // onChange: () => {
        //     console.log("onChange");
        // },
    },
    render: (props) => {
        return <DateCalendar {...props} />;
    },
};
