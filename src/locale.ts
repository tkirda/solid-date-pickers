import { createSignal } from "solid-js";

export const [defaultLocale, setDefaultLocale] = createSignal(navigator.language);
