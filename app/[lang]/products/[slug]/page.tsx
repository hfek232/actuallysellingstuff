// app/[lang]/products/[slug]/page.tsx
// This page displays individual product details, integrating with internationalization
// and fetching data from Supabase. It is a Server Component, leveraging generateStaticParams
// for static pre-rendering.

import { createClient as createStaticClient } from '@/utils/supabase/client'; // Supabase client for static generation (build time)
import { createClient } from '@/utils/supabase/server'; // Supabase client for server-side data fetching (request time)
import MaxWidthWrapper from '@/components/MaxWidthWrapper'; // Your layout wrapper component
import { notFound } from 'next/navigation'; // Next.js utility to render a 404 page

// Imports for i18n on Server Components
import { createInstance, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import path from 'path'; // Node.js path module for file system operations
import { promises as fs } from 'fs'; // Node.js file system module for reading files
import i18nConfig from '@/i18nConfig'; // Your internationalization configuration
import Link from 'next/link'; // Next.js Link component for client-side navigation
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
 // Icons

// Helper function to get the translation function for Server Components.
// This function initializes a fresh i18next instance for each server-side request
// and loads the necessary translation resources from the public/locales directory.
async function getT(locale: string, namespaces: string[]) {
  const i18nInstance = createInstance(); // Create a new i18next instance
  i18nInstance.use(initReactI18next); // Integrate react-i18next

  const loadedResources: Resource = {};
  loadedResources[locale] = loadedResources[locale] || {}; // Ensure locale object exists

  // Loop through each required namespace to load its JSON translation file
  for (const ns of namespaces) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${ns}.json`);
      const fileContents = await fs.readFile(filePath, 'utf8');
      loadedResources[locale][ns] = JSON.parse(fileContents); // Parse and assign the JSON content
    } catch (error) {
      console.error(`Error loading translation for locale '${locale}', namespace '${ns}' on product page:`, error);
      // Fallback to default locale if current locale's namespace fails
      try {
        const defaultFilePath = path.join(process.cwd(), 'public', 'locales', i18nConfig.defaultLocale, `${ns}.json`);
        const defaultFileContents = await fs.readFile(defaultFilePath, 'utf8');
        loadedResources[locale][ns] = JSON.parse(defaultFileContents); // Assign fallback content
        console.warn(`Loaded fallback for ${locale}/${ns} from ${i18nConfig.defaultLocale}/${ns}.`);
      } catch (fallbackError) {
        console.error(`CRITICAL: Could not load any translation for namespace '${ns}' on product page:`, fallbackError);
        loadedResources[locale][ns] = {}; // Provide an empty object to prevent crashes
      }
    }
  }

  // Initialize the i18next instance with the loaded resources
  await i18nInstance.init({
    lng: locale, // Set the current language
    resources: loadedResources, // Provide the loaded translation data
    fallbackLng: i18nConfig.defaultLocale, // Fallback language if a translation is missing
    supportedLngs: i18nConfig.locales, // List of all supported languages
    defaultNS: namespaces[0], // Default namespace to use (e.g., 'common')
    ns: namespaces, // All namespaces to load for this instance
    preload: [], // Resources are already loaded
    debug: false, // Set to true for debugging translation issues
    interpolation: {
      escapeValue: false, // React already protects against XSS, allows HTML in translations
    },
  });

  return i18nInstance.t; // Return the translation function
}

// CRITICAL: Define namespaces needed for this page
const i18nNamespaces = ['common', 'products'];

// Interface for ProductPage component props, including 'lang' and 'slug'
interface ProductPageProps {
  params: Promise<{ lang: string; slug: string }>; // params is a direct object on Server Components
}

/**
 * generateStaticParams is a Next.js App Router function that tells Next.js
 * which dynamic segments ([lang] and [slug]) should be pre-rendered at build time.
 * This function runs at build time on the server.
 */
export async function generateStaticParams() {
  const supabase = createStaticClient(); // Use client-side Supabase for static generation

  // Fetch all product slugs from your Supabase table
  const { data: products, error } = await supabase
    .from('products')
    .select('slug'); // Only fetch the 'slug' column to minimize data transfer

  if (error) {
    console.error('Error fetching slugs for generateStaticParams:', error);
    return []; // Return an empty array if there's an error
  }

  // Generate params for ALL combinations of locales and product slugs.
  // This ensures Next.js builds pages like /en/products/product-1, /am/products/product-1, etc.
  const params = [];
  for (const locale of i18nConfig.locales) {
    for (const product of products) {
      params.push({
        lang: locale,
        slug: product.slug,
      });
    }
  }
  return params;
}

// The ProductPage Server Component for displaying individual product details.
export default async function ProductPage({ params }: ProductPageProps) {
  // Destructure both 'lang' (locale) and 'slug' from the params object.
  const { lang: locale, slug } = await params;

  // Get the translation function for this page based on the current locale.
  // CRITICAL: Pass both 'common' and 'products' namespaces to getT
  const t = await getT(locale, i18nNamespaces);

  const supabase = await createClient(); // Initialize server-side Supabase for data fetching

  // Fetch the full details of the specific product based on its slug.
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug) // Filter by the product slug
    .single(); // Expecting a single result

  // If there's an error or the product is not found, trigger Next.js's notFound()
  // which will render your app/not-found.tsx page.
  if (error || !product) {
    console.error('Error fetching product details:', error);
    notFound();
  }

  // If product data is successfully fetched, display it.
  return (
    <MaxWidthWrapper className="py-8">
      {/* CRITICAL FIX: Explicitly specify namespace for products keys */}
      <h1 className="text-3xl font-bold mb-4">{t('product_name_prefix', { ns: 'products' })}: {product.name}</h1>
      <p className="text-lg text-gray-700 mb-2">{t('brand_prefix', { ns: 'products' })}: {product.brand}</p>
      <p className="text-lg text-gray-700 mb-2">{t('category_prefix', { ns: 'products' })}: {product.category}</p>
      <p className="text-2xl font-semibold text-blue-600 mb-4">{t('price_prefix', { ns: 'products' })}: {product.price_birr} {t('birr_currency', { ns: 'products' })}</p>
      {product.description && <p className="text-gray-800 mb-4">{product.description}</p>}
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="max-w-full h-auto rounded-lg shadow-md mb-4"
        />
      )}
      <p className="text-sm text-gray-500 mt-6">
        {t('product_slug_message', { ns: 'products' })}: `{slug}` ({t('page_prebuilt_message', { ns: 'products' })})
      </p>
      {/* Back to Products button, including the current locale in the path */}
      {/* CRITICAL FIX: Link href uses translated path segment from 'common' */}
      <Link href={`/${locale}/${t('products_link_path', { ns: 'common' })}`} passHref>
        <Button className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_products_button', { ns: 'products' })}
        </Button>
      </Link>
    </MaxWidthWrapper>
  );
}