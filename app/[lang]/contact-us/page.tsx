// app/[lang]/contact-us/page.tsx
'use client'; // This page will also be a Client Component

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ContactForm from '@/components/ContactForm'; // Import your new ContactForm component
import { useTranslation } from 'react-i18next'; // For any page-specific titles/text
import { useParams } from 'next/navigation';

export default function ContactUsPage() {
  const { t } = useTranslation('common'); // Use common for general page titles
  const params = useParams();
  const locale = typeof params.lang === 'string' ? params.lang : 'en';

  return (
    <MaxWidthWrapper className="py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t('contact_us', { ns: 'common' })} {/* Assuming 'contact_us' is in common.json */}
      </h1>
      <p className="text-lg text-center text-gray-700 mb-12">
        {t('contact_us_description', { ns: 'common' })} {/* Add a description key to common.json */}
      </p>
      <ContactForm />
    </MaxWidthWrapper>
  );
}