export const languages = ['en', 'pt', 'es', 'de'] as const;

export type Language = typeof languages[number];