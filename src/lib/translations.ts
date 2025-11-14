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
 * Get the current locale from browser or default to 'en'
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
 * Set the locale preference
 */
export function setLocale(locale: Locale): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
    // Trigger a custom event so components in the same tab can react
    window.dispatchEvent(new Event("localechange"));
  }
}

/**
 * Get a translation value by key path (e.g., "headerSection.kicker")
 */
export function t(key: TranslationKey, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const translationsData = translations[currentLocale];
  const [section, item] = key.split(".") as [keyof TranslationData, string];
  return (translationsData[section] as Record<string, string>)[item] || key;
}

/**
 * Hook to get and set the current locale
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
 * Type-safe translation hook that returns the full translation object for a section
 * Automatically detects locale from localStorage or browser settings
 * Reacts to locale changes via storage events
 */
export function useTranslations<T extends keyof TranslationData>(
  section: T,
): TranslationData[T] {
  const [currentLocale] = useLocale();

  return useMemo(() => translations[currentLocale][section], [currentLocale, section]);
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

