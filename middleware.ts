// middleware.ts
// This file handles internationalized routing using next-i18n-router.

import { i18nRouter } from 'next-i18n-router'; // Import the i18n router utility
import type { NextRequest } from 'next/server'; // Import Next.js request type
import i18nConfig from './i18nConfig'; // Import your i18n configuration

// This is the middleware function that will run on every request.
export function middleware(request: NextRequest) {
  // Use the i18nRouter to handle locale detection and redirection/rewriting.
  // It takes the current request and your i18n configuration.
  return i18nRouter(request, i18nConfig);
}

// Configuration for the middleware matcher.
// This specifies which paths the middleware should apply to.
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next|favicon.ico).*)', // Apply to all paths except API routes, static files, and Next.js internals
};
