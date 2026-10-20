// components/DiagonalImageRow.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react'; // Note: check if you are using 'motion/react' or 'framer-motion'
import Image from 'next/image';

interface DiagonalImageRowProps {
  images: string[];
  xOffset: string;
  yOffset: string;
  rowHeight?: string;
}

const DiagonalImageRow: React.FC<DiagonalImageRowProps> = ({
  images = [],           // Safety: default to empty array
  xOffset = "0px",       // Safety: default to no movement
  yOffset = "0px",       // Safety: default to no movement
  rowHeight = 'h-48',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // These will now never be undefined because of the default props above
  const x = useTransform(scrollYProgress, [0, 1], ["0px", xOffset]);
  const y = useTransform(scrollYProgress, [0, 1], ["0px", yOffset]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${rowHeight} flex items-center overflow-hidden`}
    >
      <motion.div
        className="flex flex-row flex-nowrap" 
        style={{ x, y }} 
      >
        {images.map((src, index) => (
          <div key={index} className="relative h-48 aspect-video flex-shrink-0 mx-2">
            <Image
              src={src}
              alt={`Diagonal Image ${index}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default DiagonalImageRow;