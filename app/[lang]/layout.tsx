// app/[lang]/layout.tsx
// This is the main layout for your internationalized Next.js App Router application.
// It handles locale detection and wraps the application with the i18n provider.

import './../globals.css'; // Import global styles
import { Inter } from 'next/font/google'; // Import font
import { notFound } from 'next/navigation'; // Next.js utility for 404
import i18nConfig from '@/i18nConfig'; // Your i18n configuration
import { I18nProvider } from '@/components/i18n-provider'; // Your client-side i18n provider
import { Header } from '@/components/header';
// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

// The main RootLayout component, which is an asynchronous Server Component.
export default async function RootLayout({
  children, // All nested pages and components
  params,   // Dynamic route parameters (e.g., { lang: 'en' })
}: Readonly<{
  children: React.ReactNode;
  // Type definition for params: it can be a direct object or a Promise that resolves to an object.
  params: Promise<{ lang: string }> | { lang: string };
}>) {
  // Await the 'params' object to ensure 'lang' is resolved before access.
  const resolvedParams = await params;
  const { lang: locale } = resolvedParams; // Destructure 'lang' and rename to 'locale'

  // Check if the requested locale is supported. If not, show the 404 page.
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}> {/* No empty lines or spaces between html and body */}
        <I18nProvider>
          <Header />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
