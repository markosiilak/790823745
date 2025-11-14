"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import enTranslations from "@/locales/en.json";
import etTranslations from "@/locales/et.json";

export type Locale = "en" | "et";

const translations = {
  en: enTranslations,
  et: etTranslations,
} as const;

type TranslationData = typeof enTranslations;

type TranslationKey = {
  [K in keyof TranslationData]: {
    [P in keyof TranslationData[K]]: `${K}.${P & string}`;
  }[keyof TranslationData[K]];
}[keyof TranslationData];

/**
 * Gets the current locale preference from localStorage or browser settings.
 * Falls back to 'en' if no preference is found.
 * Only runs in browser environment (returns 'en' during SSR).
 *
 * @internal
 */
function getLocale(): Locale {
  if (typeof window === "undefined") return "en";

  // Try to get from localStorage first
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored && (stored === "en" || stored === "et")) {
    return stored;
  }

  // Fallback to browser language
  const browserLang = navigator.language.split("-")[0];
  return browserLang === "et" ? "et" : "en";
}

/**
 * Sets the locale preference and persists it to localStorage.
 * Dispatches a custom 'localechange' event to notify other components in the same tab.
 * Only works in browser environment.
 */
export function setLocale(locale: Locale): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
    // Trigger a custom event so components in the same tab can react
    window.dispatchEvent(new Event("localechange"));
  }
}

/**
 * Gets a translation value by a dot-notation key path.
 * Provides a fallback to the key itself if translation is not found.
 * Used for server-side or non-React contexts.
 */
export function t(key: TranslationKey, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const translationsData = translations[currentLocale];
  const [section, item] = key.split(".") as [keyof TranslationData, string];
  return (translationsData[section] as Record<string, string>)[item] || key;
}

/**
 * React hook to get and set the current locale.
 * Always starts with 'en' on initial render to prevent hydration mismatches.
 * Updates to the actual locale after component mounts on the client.
 * Listens to localStorage changes and custom 'localechange' events for cross-tab synchronization.
 */
export function useLocale(): [Locale, (locale: Locale) => void] {
  // Always start with "en" to prevent hydration mismatch
  // We'll update to the actual locale after mount on the client
  const [currentLocale, setCurrentLocaleState] = useState<Locale>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set mounted flag and update to actual locale after first render
    setIsMounted(true);
    setCurrentLocaleState(getLocale());

    // Update locale when storage changes
    const handleStorageChange = () => {
      setCurrentLocaleState(getLocale());
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom storage events (same tab)
    window.addEventListener("localechange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localechange", handleStorageChange);
    };
  }, []);

  const updateLocale = useCallback((locale: Locale) => {
    setLocale(locale);
    setCurrentLocaleState(locale);
  }, []);

  // Return "en" during SSR and initial client render, then the actual locale after mount
  return [isMounted ? currentLocale : "en", updateLocale];
}

/**
 * Type-safe React hook that returns the full translation object for a specific section.
 * Automatically updates when locale changes (via localStorage events).
 * Provides TypeScript autocompletion for translation keys.
 */
export function useTranslations<T extends keyof TranslationData>(
  section: T,
): TranslationData[T] {
  const [currentLocale] = useLocale();

  return useMemo(() => translations[currentLocale][section], [currentLocale, section]);
}

/**
 * Gets all available locale codes in the translation system.
 */
export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

