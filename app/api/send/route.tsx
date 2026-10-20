// app/send/route.ts
// This API route handles sending emails using Resend, with support for i18n.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Node.js modules for file system operations (for server-side i18n)
import path from 'path';
import { promises as fs } from 'fs';

// i18next imports for server-side translation
import { createInstance, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18nConfig from '@/i18nConfig'; // Your i18n configuration

// React Email imports
import { render } from '@react-email/render'; // Import render function
import { ContactFormEmail } from '@/emails/ContactFormEmail';
// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to get the translation function for server-side use (API routes).
async function getTForApi(locale: string, namespaces: string[]) {
  const i18nInstance = createInstance();
  i18nInstance.use(initReactI18next);

  const loadedResources: Resource = {};
  loadedResources[locale] = loadedResources[locale] || {};

  for (const ns of namespaces) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${ns}.json`);
      const fileContents = await fs.readFile(filePath, 'utf8');
      loadedResources[locale][ns] = JSON.parse(fileContents);
    } catch (error) {
      console.error(`API: Error loading translation for locale '${locale}', namespace '${ns}':`, error);
      try {
        const defaultFilePath = path.join(process.cwd(), 'public', 'locales', i18nConfig.defaultLocale, `${ns}.json`);
        const defaultFileContents = await fs.readFile(defaultFilePath, 'utf8');
        loadedResources[locale][ns] = JSON.parse(defaultFileContents);
        console.warn(`API: Loaded fallback for ${locale}/${ns} from ${i18nConfig.defaultLocale}/${ns}.`);
      } catch (fallbackError) {
        console.error(`API: CRITICAL: Could not load any translation for namespace '${ns}'.`, fallbackError);
        loadedResources[locale][ns] = {};
      }
    }
  }

  await i18nInstance.init({
    lng: locale,
    resources: loadedResources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    ns: namespaces,
    preload: [],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18nInstance.t;
}

// Define namespaces needed for email content.
const EMAIL_NAMESPACES = ['common', 'email'];

// POST handler for sending emails
export async function POST(request: Request) {
  try {
    // Parse the request body to get email details
    const { to, subjectKey, bodyKey, dynamicData, preferredLocale } = await request.json();

    // Determine the locale for the email content.
    const locale = preferredLocale ||
                   request.headers.get('Accept-Language')?.split(',')[0].split('-')[0] ||
                   i18nConfig.defaultLocale;

    console.log(`API: Sending email for locale: ${locale}`);

    // Get the translation function for the determined locale
    const t = await getTForApi(locale, EMAIL_NAMESPACES);

    // Translate the subject and body using the fetched translations
    const translatedSubject = t(subjectKey, { ns: 'email', ...dynamicData });
    const translatedBody = t(bodyKey, { ns: 'email', ...dynamicData });
    const emailSignature = t('email_signature', { ns: 'email' });

    // CRITICAL FIX: Render the React email component to HTML string
    // Pass the component as a JSX element, not just its type.
    const emailHtml = render(
      <ContactFormEmail
        userName={dynamicData.userName}
        userEmail={dynamicData.userEmail}
        userMessage={dynamicData.userMessage}
        translatedSubject={String(translatedSubject)}
        translatedBody={String(translatedBody)}
        emailSignature={String(emailSignature)}
        locale={locale} // Pass locale to the email template for lang attribute
      />
    );

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>', // IMPORTANT: Replace with your verified Resend email sender
      to: [to],
      subject: translatedSubject,
      html: emailHtml, // Send the rendered HTML
    });

    if (error) {
      console.error('API: Error sending email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('API: Email sent successfully:', data);
    return NextResponse.json({ message: 'Email sent successfully', data });

  } catch (error) {
    console.error('API: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Optional: Define a GET handler if you want to test the API route directly
export async function GET() {
  return NextResponse.json({ message: 'Email API is running. Use POST to send emails.' });
}
