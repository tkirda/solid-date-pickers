import { FormControl, InputLabel, MenuItem, Select } from "@suid/material";
import { defaultLocale, setDefaultLocale } from "solid-date-pickers";

// You can set the default locale once for the entire application.
setDefaultLocale("en-US");

export default function SetDefaultLocale() {
    return (
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="locale-label">Locale</InputLabel>
            <Select
                labelId="locale-label"
                label="Locale"
                value={defaultLocale()}
                onChange={(e) => setDefaultLocale(e.target.value)}
            >
                <MenuItem value="de-DE">German (de-DE)</MenuItem>
                <MenuItem value="en-GB">English (en-GB)</MenuItem>
                <MenuItem value="en-US">English (en-US)</MenuItem>
                <MenuItem value="es-ES">Spanish (es-ES)</MenuItem>
                <MenuItem value="fr-FR">French (fr-FR)</MenuItem>
                <MenuItem value="ja-JP">Japanese (ja-JP)</MenuItem>
                <MenuItem value="lt-LT">Lithuanian (lt-LT)</MenuItem>
                <MenuItem value="pt-BR">Portuguese (pt-BR)</MenuItem>
                <MenuItem value="ru-RU">Russian (ru-RU)</MenuItem>
                <MenuItem value="zh-CN">Chinese (zh-CN)</MenuItem>
            </Select>
        </FormControl>
    );
}
