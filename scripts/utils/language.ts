export const languages = ["fr", "es", "en", "pt", "de"] as const;
export type Language = (typeof languages)[number];