/**
 * Pads the start of a string with a specified character until it reaches a specified length.
 * @param str The string to pad.
 * @param length The desired length of the padded string.
 * @param pad The character used for padding.
 * @returns The padded string.
 */
export const padStart = (str: string, length: number, pad: string) => {
    while (str.length < length) {
        str = pad + str;
    }

    return str;
};
