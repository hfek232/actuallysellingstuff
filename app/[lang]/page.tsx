// app/[lang]/page.tsx
'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Handshake, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import { useParams } from 'next/navigation'; // Import useParams
import {SignUpDialog} from '@/components/SignUpDialog'; // Import your SignUpDialog component
 import {motion} from 'motion/react'; // Import motion for animations
import DiagonalImageRow from '@/components/DiagonalImageRow'; // Import your diagonal image row component
import DynamicWaveBackground from '@/components/DynamicWaveBackground'; // Import your dynamic wave background component
  // Create a motion-enhanced version of the Shadcn Button
const MotionButton = motion(Button);
import Image from 'next/image'

export default function HomePage() {
  // CRITICAL: Use both 'common' and 'homepage' namespaces
  // 'common' is for general link paths, 'homepage' for homepage specific text.
  const { t } = useTranslation(['common', 'homepage']);
  const params = useParams();
  const locale = typeof params.lang === 'string' ? params.lang : 'en';

  console.log('HomePage rendering. Current locale:', locale);
  // Example of accessing a key from the 'homepage' namespace
  // CRITICAL FIX: Explicitly specify namespace for homepage keys
  console.log('Translation for homepage.welcome_title:', t('welcome_title', { ns: 'homepage' }));

  return (
     
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6.5rem)] text-center py-12 bg-gray-50">
      {/* Hero Section */}
      <MaxWidthWrapper
        className="
          relative z-0 w-full h-screen max-w-none /* Keep these for full-bleed background */
          flex flex-col items-center justify-center text-center /* These center the *overall* content vertically */
          -py-24  -mt-40 px-4 /* Adjust these as needed for overall vertical positioning */
          hero-with-sepia-bg
          overflow-hidden 
        "
      >
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Content of the Hero Section - THIS IS WHERE WE INTRODUCE THE GRID */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Apply Grid to this inner container for better control over its children */}
          <div
            className="
              grid grid-cols-1          /* For now, a single column to maintain vertical stack */
              gap-y-22                   /* Control vertical spacing between grid items */
              place-items-center        /* Center all grid items both horizontally and vertically */
              text-center               /* Ensure text within children remains centered */
              py-16 md:py-24            /* Add back desired padding for the content block */
            "
          >
            <DiagonalImageRow/>
 <h1 className=" tracking-wider text-5xl md:text-6xl lg:text-8xl font-extrabold text-white mb-6 leading-tight     text-shadow-[4px_4px_8px_rgba(0,0,0,0.7)]
">
          {/* CRITICAL FIX: Explicitly specify namespace for homepage keys */}
          {t('welcome_title', { ns: 'homepage' })}
        </h1>    

            {/* Your Subtitle (p) */}
            <p className="
             text-2xl text-shadow-[1px_2px_2px_#FF0FFF] tracking-widest font-extrabold 
              md:text-4xl text-white mb-10 max-w-3xl /* remove mb-10 if gap-y is preferred */
            ">
              {t('welcome_subtitle', { ns: 'homepage' })}
            </p>

            {/* Your Buttons Div (can remain flex for internal layout) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${locale}/${t('mart_link_path', { ns: 'common' })}`} passHref>
                <MotionButton whileHover={{
    scale: 1.2,
    transition: { duration: 1 },
  }}
  whileTap={{ scale: 0.9 }} 
      size="lg" className="
                  bg-emerald-600 hover:bg-emerald-700 opacity-70
                  px-12 md:px-16 lg:px-20
                  text-white text-lg py-12 rounded-lg shadow-lg transition min-w-[400px] duration-300
                ">
                  <ShoppingBag className="mr-2 h-14 w-14" />
                  <p className="text-2xl"> {t('find_products_button', { ns: 'homepage' })}</p>
                </MotionButton>
              </Link>
              <Link href={`/${locale}/${t('contact_us_link_path', { ns: 'common' })}`} passHref>
                <MotionButton   
        whileHover={{
    scale: 1.2,
    transition: { duration: 1 },
  }}
  whileTap={{ scale: 0.9 }}
  
      
         className="
                  border-blue-600 text-blue-600 text-2xl hover:bg-blue-50
                  p-14 px-30 min-w-[400px] py-12 rounded-lg shadow-md transition duration-300
                ">
                  <Handshake className="text-2xl mr-2 h-8 w-8" /> {t('become_supplier_button', { ns: 'homepage' })}
                </MotionButton>
              </Link>
<span className="z-99 block bg-red-500 w-[300px] h-[300px]  "></span>            </div>
          </div>
        </div>
      </MaxWidthWrapper>
            <motion.div
              className="min-w-full h-full -mt-100" >// Motion div to apply transforms to
              <div className="min-w-full min-h-screen bg-[#fadec5] flex flex-col items-center justify-center border-black border-2 text-black text-2xl">
        {/* Make sure it's not self-closing if you want content inside */}
        This is my new full-bleed background section!
        <DynamicWaveBackground />
        <p>asdf</p>
        {/* You can put more content here */}
      </div>
            </motion.div>
      

      {/* Call to Action for Suppliers (Optional, can be separate section) */}
      <MaxWidthWrapper className="py-16 md:py-24 px-4 mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {t('supplier_cta_title', { ns: 'homepage' })}
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
          {t('supplier_cta_subtitle', { ns: 'homepage' })}
        </p>
        {/* Link to Supplier Onboarding, using translated path segment from 'common' */}
        <Link href={`/${locale}/${t('supplier_onboarding_link_path', { ns: 'common' })}`} passHref>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition duration-300">
            <Handshake className="mr-2 h-5 w-5" /> {t('join_supplier_button', { ns: 'homepage' })}
          </Button>
        </Link>
        {/* Add your new pop-up component here! */}
          <SignUpDialog /> 
          {/* You could also place this button separately if it's not part of this specific row */}

      </MaxWidthWrapper>
    </div>
  );
}