// components/i18n-provider.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { useParams } from 'next/navigation';
import i18nConfig from '@/i18nConfig';

interface I18nProviderProps {
  children: ReactNode;
}

// Define all namespaces that client components might use.
// This array is used for initial setup and subsequent checks.
const ALL_EXPECTED_NAMESPACES = ['common', 'homepage', 'products','email'
];

// Create a memoized i18next instance for the client.
const clientI18nInstance = createInstance();
clientI18nInstance.use(initReactI18next);

// CRITICAL FIX: Initialize the i18next instance immediately after creation.
// This ensures that methods like hasResourceBundle are available from the start,
// and i18next is aware of all potential namespaces.
clientI18nInstance.init({
  lng: i18nConfig.defaultLocale, // Initialize with a default language
  fallbackLng: i18nConfig.defaultLocale,
  supportedLngs: i18nConfig.locales,
  ns: ALL_EXPECTED_NAMESPACES, // Inform i18next about all namespaces from the start
  defaultNS: 'common', // Set default namespace
  debug: true, // Keep debug true to see i18next's internal logs
  interpolation: {
    escapeValue: false,
  },
  resources: {}, // Initialize with empty resources; they will be loaded in useEffect
});


export function I18nProvider({ children }: I18nProviderProps) {
  const params = useParams();
  const locale = typeof params.lang === 'string' ? params.lang : i18nConfig.defaultLocale;

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.groupCollapsed(`I18nProvider useEffect for locale: ${locale}`);
    console.log('Current i18nInstance language:', clientI18nInstance.language);
    console.log('Is I18nProvider initialized state (useState):', isInitialized); // Log state value
    console.log('All expected namespaces:', ALL_EXPECTED_NAMESPACES);

    // Check if the i18next instance is fully configured for this locale
    // by verifying if its language matches AND all expected namespaces are loaded.
    const isFullyConfiguredForLocale = clientI18nInstance.language === locale &&
      ALL_EXPECTED_NAMESPACES.every(ns => clientI18nInstance.hasResourceBundle(locale, ns));

    console.log('Is i18nInstance fully configured for current locale (i18next check)?', isFullyConfiguredForLocale);


    // CRITICAL FIX: Proceed with loading and initialization if:
    // 1. The i18next instance is NOT fully configured for the current locale.
    // 2. OR the component's internal `isInitialized` state is false (for the very first render).
    // This condition covers initial load, locale changes, and cases where resources might be missing.
    if (locale && (!isFullyConfiguredForLocale || !isInitialized)) { // Added || !isInitialized
      console.log('Condition met for initialization. Proceeding with async load and init.');
      const loadAndInitI18n = async () => {
        const fetchedResources: Resource = {}; // Use a temporary object to hold fetched data

        for (const ns of ALL_EXPECTED_NAMESPACES) { // Loop through each namespace to fetch its file
          // Optimization: Only fetch if the resource bundle is NOT already present in the instance
          if (!clientI18nInstance.hasResourceBundle(locale, ns)) {
            try {
              console.log(`Attempting to fetch /locales/${locale}/${ns}.json`);
              const response = await fetch(`/locales/${locale}/${ns}.json`);
              if (!response.ok) {
                throw new Error(`Failed to load translation for ${locale}/${ns}.json. Status: ${response.status}`);
              }
              fetchedResources[ns] = await response.json(); // Store fetched data by namespace
              console.log(`Successfully loaded ${locale}/${ns}.json`);
            } catch (error) {
              console.error(`Error loading translation for locale '${locale}', namespace '${ns}' on client:`, error);
              // Fallback to default locale if current locale's namespace fails
              try {
                console.log(`Attempting to fetch fallback /locales/${i18nConfig.defaultLocale}/${ns}.json`);
                const fallbackResponse = await fetch(`/locales/${i18nConfig.defaultLocale}/${ns}.json`);
                if (!fallbackResponse.ok) {
                  throw new Error(`Failed to load fallback translation for ${i18nConfig.defaultLocale}/${ns}.json. Status: ${fallbackResponse.status}`);
                }
                fetchedResources[ns] = await fallbackResponse.json(); // Store fallback data
                console.warn(`Loaded fallback for ${locale}/${ns} from ${i18nConfig.defaultLocale}/${ns}.`);
              } catch (fallbackError) {
                console.error(`CRITICAL: Could not load any translation for namespace '${ns}' on client.`, fallbackError);
                fetchedResources[ns] = {}; // Provide an empty object to prevent crashes
              }
            }
          } else {
            console.log(`Namespace '${ns}' for locale '${locale}' already present in i18n instance. Using existing.`);
            // If already present, ensure it's part of the resources passed to init (though init itself handles merging)
            // fetchedResources[ns] = clientI18nInstance.getResourceBundle(locale, ns); // No need to re-add if already present
          }
        }

        // --- DEBUGGING STEP ---
        console.log('Fetched resources before adding to instance:', fetchedResources);
        // --- END DEBUGGING STEP ---

        // CRITICAL FIX: Add each fetched namespace bundle to the i18next instance individually
        // This ensures resources are correctly added to their respective namespaces.
        for (const ns of ALL_EXPECTED_NAMESPACES) {
            if (fetchedResources[ns]) { // Only add if we actually fetched something for this namespace
                clientI18nInstance.addResourceBundle(locale, ns, fetchedResources[ns], true, true);
            }
        }

        // Now, change the language. i18next options (ns, defaultNS) were set during initial init.
        await clientI18nInstance.changeLanguage(locale);
        
        console.log('i18nInstance updated. Current language:', clientI18nInstance.language);
        console.log('i18nInstance resources:', clientI18nInstance.services.resourceStore.data);
        setIsInitialized(true); // Mark as initialized after successful load and language change
      };

      loadAndInitI18n();
    } else {
      console.log('I18nProvider already initialized for this locale with all namespaces. No re-init needed.');
      // If it's already fully configured, ensure isInitialized is true
      if (clientI18nInstance.language === locale && ALL_EXPECTED_NAMESPACES.every(ns => clientI18nInstance.hasResourceBundle(locale, ns))) {
          setIsInitialized(true);
      }
    }
    console.groupEnd();
  }, [locale, isInitialized]); // isInitialized is back in dependencies to trigger on initial false state

  // Render children only when i18next is fully initialized on the client
  if (!isInitialized) {
    console.log('I18nProvider not yet initialized, returning null.');
    return null; // Or a loading spinner, to prevent rendering untranslated content
  }

  console.log('I18nProvider rendering children.');
  return (
    <I18nextProvider i18n={clientI18nInstance}>
      {children}
    </I18nextProvider>
  );
}
