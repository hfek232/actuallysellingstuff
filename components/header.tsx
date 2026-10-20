'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// 1. Add useParams to your imports
import { useParams } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

// Update ListItem to handle dynamic paths
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; children?: React.ReactNode }
>(({ className, title, children, href, ...props }, ref) => {
  const params = useParams();
  const lang = params?.lang || 'en'; // Fallback to 'en' if lang is undefined

  // Prepend lang to href if it's a string
  const dynamicHref = typeof href === 'string' && !href.startsWith('http') 
    ? `/${lang}${href === '/' ? '' : href}` 
    : href;

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link 
          {...props} 
          href={dynamicHref || '#'} 
          ref={ref} 
          className={cn('block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors','hover:bg-accent hover:text-accent-foreground','focus:bg-accent focus:focus-text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1',className)}>
          <div>
            <div className="text-sm font-medium leading-no text-foreground">{title}</div>
            {typeof children === 'string' && (<p className="text-sm leading-tight text-muted-foreground">{children}</p>)}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export function Header() {
  // 2. Extract the current language from the URL
  const params = useParams();
  const lang = params?.lang || 'en';

  return (
    <header className="sticky top-0 z-[999] h-26 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center w-full px-4 lg:px-8" style={{ minHeight: '6.5rem' }}>
        
        {/* Left: Logo - Link to home for current language */}
        <div className="flex items-center flex-shrink-0">
          <Link href={`/${lang}`} className="mr-6 flex items-center max-w-[250px] max-h-[81px] space-x-2 p-2">
            <Image
              src="/momona-log.svg"
              alt="Momona Designs Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex-1 flex justify-center">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex w-full gap-x-16">
              
              <NavigationMenuItem className="flex-1 flex justify-center">
                {/* Fixed Home Link */}
                <NavigationMenuLink asChild>
                  <Link href={`/${lang}`} className={cn(navigationMenuTriggerStyle(), "text-4xl")}>
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuTrigger><p className="text-4xl">Products</p></NavigationMenuTrigger>
                <NavigationMenuContent>
                  {/* ...dropdown content - ensure you use <ListItem href="/products/item" /> ... */}
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Fixed Our Story Link */}
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuLink asChild>
                  <Link href={`/${lang}/our-story`} className={cn(navigationMenuTriggerStyle(), "text-4xl")}>
                    Our Story
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Fixed Contact Us Link */}
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuLink asChild>
                  <Link href={`/${lang}/contact-us`} className={cn(navigationMenuTriggerStyle(), "text-4xl")}>
                    Contact Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Section remains unchanged as it uses tel: and doesn't need i18n routing */}
        <div className="ml-6 flex-col items-center space-x-4 flex-shrink-0">
          <a href="tel:+251931674429" className="group focus:outline-none">
            <Phone className="animate-pulse text-[#bc6c25] h-6 w-6" />
            <h1 className="text-[#150b02] text-sm md:text-2xl">Sales and Support</h1>
          </a>
        </div>
      </div>
    </header>
  );
}