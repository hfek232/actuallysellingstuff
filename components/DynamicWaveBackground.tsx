// components/DynamicWaveBackground.tsx
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef } from 'react'; // Explicitly import React for consistency with hooks

const DynamicWaveBackground = () => {
  // Type the useRef hook to specify that it will reference an HTMLDivElement.
  // Initialize with null, as the ref won't be set until the component mounts.
  const ref = useRef<HTMLDivElement>(null);

  // useScroll hook to track scroll position relative to the element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'], // When element enters/leaves viewport
  });

  // useTransform to map scroll progress to a scale value.
  // The 'scale' variable will be a MotionValue<number>, which Framer Motion
  // automatically handles when passed to the 'style' prop of a motion component.
  const scale = useTransform(scrollYProgress, [0, 1], [1.0889, 1.0]); // Scales from original zoom to no zoom

  return (
    <>
    <div
      ref={ref} // Attach ref to the container div
      className="relative w-full h-[300px] -mt-40 md:h-[500px] lg:h-[700px] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0" // Motion div to apply transforms to
        style={{ scale: scale }} // Apply the dynamic scale
      >
        <Image
          src="/waves.png"
          alt="Artistic wave background"
          fill // 'fill' makes the image cover its parent element
          className="object-cover" // Ensures the image covers the area, cropping if necessary
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          priority // Prioritize loading for hero image
        />
      </motion.div>
        
    </div>
  
      </>
  );
};

export default DynamicWaveBackground;