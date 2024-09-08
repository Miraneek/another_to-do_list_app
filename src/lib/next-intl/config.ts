export type Locale = (typeof locales)[number];

export const locales = ['en', 'cz'] as const;
export const defaultLocale: Locale = 'en';