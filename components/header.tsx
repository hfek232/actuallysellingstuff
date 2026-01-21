'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string; children?: React.ReactNode }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link {...props} ref={ref} className={cn('block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors','hover:bg-accent hover:text-accent-foreground','focus:bg-accent focus:focus-text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1',className)}>
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
  return (
    <header className="sticky top-0 z-[999] h-26 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center w-full px-4 lg:px-8" style={{ minHeight: '6.5rem' }}>
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="mr-6 flex items-center max-w-[250px] max-h-[81px] space-x-2 p-2">
            <Image
              src="/momona-log.svg"
              alt="Momona Designs Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Middle: Navigation (stretches full width) */}
        <nav className="flex-1 flex justify-center">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex w-full gap-x-16">
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuLink href="/" className={cn(navigationMenuTriggerStyle(), "text-4xl")}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuTrigger><p className="text-4xl">Products</p></NavigationMenuTrigger>
                <NavigationMenuContent>
                  {/* ...dropdown content... */}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuTrigger><p className="text-4xl">Services</p></NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  {/* ...dropdown content... */}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuLink href="/our-story" className={navigationMenuTriggerStyle()}>
          <span className="text-4xl">Our Story</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex-1 flex justify-center">
                <NavigationMenuLink href="/contact-us" className={navigationMenuTriggerStyle()}>
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right: Sales/Support/Phone */}
        <div className="ml-6 flex-col items-center space-x-4 flex-shrink-0">
          <a href="tel:+251931674429" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Phone className="animate-pulse text-[#bc6c25] opacity-90 h-6 w-6 md:h-7 md:w-7 flex-shrink-0 group-hover:text-primary transition-colors" />
            <h1 className="text-[#150b02] opacity-80 font-poppins text-sm md:text-2xl">Sales and Support</h1>
            <span className="text-[#1b1108] text-sm">+251 931674429</span>
          </a>
        </div>
      </div>
    </header>
  );
}