import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@1.0.0';

import { render } from 'https://esm.sh/@react-email/render@0.0.12';
import * as React from 'https://esm.sh/react@18.2.0';
import {
  Html, Head, Body, Container, Text, Link, Hr, Heading
} from 'https://esm.sh/@react-email/components@0.0.14';

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Inter, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a202c',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.5',
  marginBottom: '20px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footerText = {
  color: '#718096',
  fontSize: '12px',
  textAlign: 'center' as const,
  lineHeight: '1.5',
};

const link = {
  color: '#2563eb',
  textDecoration: 'none',
};

const EMAIL_NAMESPACES = ['common', 'email'];

const i18nConfig = {
  locales: ['en', 'am'],
  defaultLocale: 'en',
};

const getTForEdgeFunction = async (locale: string, namespaces: string[]) => {
  const i18nInstance = i18next.createInstance();

  const resources: Record<string, any> = {};

  for (const ns of namespaces) {
    try {
      const publicLocalesBaseUrl = Deno.env.get('PUBLIC_LOCALES_BASE_URL') || 'https://raw.githubusercontent.com/your-username/your-repo/main/public/locales';
      const response = await fetch(`${publicLocalesBaseUrl}/${locale}/${ns}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translation for ${locale}/${ns}.json. Status: ${response.status}`);
      }
      resources[ns] = await response.json();
    } catch (error) {
      console.error(`Edge Function: Error loading translation for locale '${locale}', namespace '${ns}':`, error);
      try {
        const publicLocalesBaseUrl = Deno.env.get('PUBLIC_LOCALES_BASE_URL') || 'https://raw.githubusercontent.com/your-username/your-repo/main/public/locales';
        const fallbackResponse = await fetch(`${publicLocalesBaseUrl}/${i18nConfig.defaultLocale}/${ns}.json`);
        if (!fallbackResponse.ok) {
          throw new Error(`Failed to load fallback translation for ${i18nConfig.defaultLocale}/${ns}.json. Status: ${fallbackResponse.status}`);
        }
        resources[ns] = await fallbackResponse.json();
        console.warn(`Edge Function: Loaded fallback for ${locale}/${ns} from ${i18nConfig.defaultLocale}/${ns}.`);
      } catch (fallbackError) {
        console.error(`Edge Function: CRITICAL: Could not load any translation for namespace '${ns}'.`, fallbackError);
        resources[ns] = {};
      }
    }
  }

  await i18nInstance.init({
    lng: locale,
    resources: { [locale]: resources },
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    ns: namespaces,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18nInstance.t;
};

serve(async (req) => {
  try {
    const payload = await req.json();
    console.log('Edge Function: Received payload:', payload);

    const { 
      id,  // New: contact submission ID
      name, 
      email, 
      message, 
      locale, 
      email_log_id  // New: email log tracking ID
    } = payload.record;

    // Existing email sending logic...

    try {
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

      const { data, error } = await resend.emails.send({
        from: 'Your App <onboarding@resend.dev>',
        to: ['admin@example.com'],
        subject: translatedSubject,
        html: emailHtml,
      });

      if (error) {
        // Log the failure in the database
        await fetch(Deno.env.get('SUPABASE_URL') + '/rest/v1/rpc/update_email_log_status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY'),
            'Authorization': 'Bearer ' + Deno.env.get('SUPABASE_ANON_KEY')
          },
          body: JSON.stringify({
            p_email_log_id: email_log_id,
            p_status: 'failed',
            p_error_message: error.message
          })
        });

        console.error('Edge Function: Error sending email:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }

      // Log the successful email send
      await fetch(Deno.env.get('SUPABASE_URL') + '/rest/v1/rpc/update_email_log_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY'),
          'Authorization': 'Bearer ' + Deno.env.get('SUPABASE_ANON_KEY')
        },
        body: JSON.stringify({
          p_email_log_id: email_log_id,
          p_status: 'sent'
        })
      });

      console.log('Edge Function: Email sent successfully:', data);
      return new Response(JSON.stringify({ message: 'Email sent successfully', data }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (emailError) {
      // Handle any unexpected errors during email sending
      await fetch(Deno.env.get('SUPABASE_URL') + '/rest/v1/rpc/update_email_log_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY'),
          'Authorization': 'Bearer ' + Deno.env.get('SUPABASE_ANON_KEY')
        },
        body: JSON.stringify({
          p_email_log_id: email_log_id,
          p_status: 'failed',
          p_error_message: emailError.message
        })
      });

      console.error('Edge Function: Unexpected email sending error:', emailError);
      return new Response(JSON.stringify({ error: 'Email sending failed' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error) {
    console.error('Edge Function: Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});