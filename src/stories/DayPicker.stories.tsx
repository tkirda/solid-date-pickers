import type { Meta, StoryObj } from "storybook-solidjs";
import DateCalendar from "../DateCalendar";

const meta = {
    title: "DateCalendar",
    component: DateCalendar,
    tags: ["autodocs"],
    argTypes: {
        onChange: { action: "onChange" },
        value: { control: { type: "date" } },
        maxDate: { control: { type: "date" } },
        minDate: { control: { type: "date" } },
        disableHighlightToday: { control: { type: "boolean" } },
        locale: {
            control: "select",
            options: [
                "en-US", // English (United States)
                "en-GB", // English (United Kingdom)
                "zh-CN", // Chinese (Simplified, China)
                "es-ES", // Spanish (Spain)
                "es-MX", // Spanish (Mexico)
                "fr-FR", // French (France)
                "de-DE", // German (Germany)
                "ja-JP", // Japanese (Japan)
                "pt-BR", // Portuguese (Brazil)
                "ru-RU", // Russian (Russia)
                "it-IT", // Italian (Italy)
                "ko-KR", // Korean (South Korea)
                "ar-SA", // Arabic (Saudi Arabia)
                "nl-NL", // Dutch (Netherlands)
                "tr-TR", // Turkish (Turkey)
                "sv-SE", // Swedish (Sweden)
                "pl-PL", // Polish (Poland)
                "da-DK", // Danish (Denmark)
                "fi-FI", // Finnish (Finland)
                "no-NO", // Norwegian (Norway)
            ],
        },
    },
    args: {
        disableHighlightToday: false,
        disablePast: false,
        disableFuture: false,
        readOnly: false,
    },
} satisfies Meta<typeof DateCalendar>;

export default meta;

type Story = StoryObj<typeof DateCalendar>;

export const Primary: Story = {
    args: {
        disableHighlightToday: false,
    },
    render: (props) => {
        return <DateCalendar {...props} />;
    },
};
