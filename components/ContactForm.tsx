// components/ContactForm.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client'; // Import client-side Supabase

function ContactForm() {
  const { t } = useTranslation(['common', 'email']);
  const params = useParams();
  const locale = typeof params.lang === 'string' ? params.lang : 'en';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(t('sending_message', { ns: 'common' }));

    try {
      const supabase = createClient(); // Initialize Supabase client

      // Insert form data into the 'contact_submissions' table
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          { name, email, message, locale } // Include the locale of the submission
        ])
        .select(); // Select the inserted data to confirm

      if (error) {
        console.error('Supabase Insert Error:', error);
        setStatus(`${t('failed_to_send_email', { ns: 'common' })}: ${error.message}`);
      } else {
        console.log('Form data saved to Supabase:', data);
        // The email sending is now handled by the Supabase Edge Function trigger
        setStatus(t('email_sent_success', { ns: 'common' }));
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      setStatus(t('unexpected_error', { ns: 'common' }));
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('contact_form_title', { ns: 'common' })}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="name" className="sr-only">{t('name_label', { ns: 'common' })}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('name_label', { ns: 'common' }) as string}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email-address" className="sr-only">{t('email_label', { ns: 'common' })}</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('email_label', { ns: 'common' }) as string}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="message" className="sr-only">{t('message_label', { ns: 'common' })}</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('message_label', { ns: 'common' }) as string}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('sending_message', { ns: 'common' }) : t('send_email_button', { ns: 'common' })}
            </Button>
          </div>

          {status && (
            <p className={`mt-2 text-center text-sm ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
