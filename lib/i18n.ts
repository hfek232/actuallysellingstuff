// lib/i18n.ts
// This file configures and exports the core i18next instance.
// It does NOT handle dynamic resource loading here; resources are passed in.

import { createInstance, i18n as I18nType, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

// Define the type for the return value of initTranslations (if still used, though we're simplifying)
export interface InitTranslationsResult {
  i18n: I18nType;
  resources: Resource;
  t: I18nType['t'];
}

// Function to create and configure an i18next instance
export function createI18nInstance() {
  const i18nInstance = createInstance();

  i18nInstance.use(initReactI18next);

  // Initialize with minimal config. Full config (lng, resources, ns)
  // will be done when passed to the I18nProvider.
  i18nInstance.init({
    debug: false, // Set to true for debugging translation issues
    interpolation: {
      escapeValue: false, // React already protects against XSS, allows HTML in translations
    },
  });

  return i18nInstance;
}

// Export the primary i18next instance for client-side use if needed,
// but for server components, createI18nInstance is preferred.
export const i18n = createI18nInstance();

// Remove the default export initTranslations function from this file.
// Its logic will be moved directly into layout.tsx.