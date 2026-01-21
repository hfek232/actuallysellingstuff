import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Hr,
  Heading,
} from '@react-email/components';

interface ContactFormEmailProps {
  userName: string;
  userEmail: string;
  userMessage: string;
  translatedSubject: string;
  translatedBody: string;
  emailSignature: string;
  locale: string;
}

export function ContactFormEmail(props: ContactFormEmailProps) {
  const {
    translatedSubject,
    translatedBody,
    emailSignature,
    locale,
  } = props;

  return React.createElement(
    Html,
    { lang: locale },
    React.createElement(
      Head,
      null
    ),
    React.createElement(
      Body,
      { style: main },
      React.createElement(
        Container,
        { style: container },
        React.createElement(
          Heading,
          { style: h1 },
          translatedSubject
        ),
        React.createElement(
          Text,
          { style: paragraph },
          ...translatedBody.split('\n').map((line, index, arr) =>
            React.createElement(
              React.Fragment,
              { key: index },
              line,
              index < arr.length - 1 ? React.createElement('br', {}) : null
            )
          )
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(
          Text,
          { style: footerText },
          emailSignature
        ),
        React.createElement(
          Text,
          { style: footerText },
          React.createElement(
            Link,
            { href: "mailto:admin@example.com", style: link },
            "admin@example.com"
          )
        )
      )
    )
  );
}

// Styles (same as before)
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