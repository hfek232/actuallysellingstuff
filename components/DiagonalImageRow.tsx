// components/DiagonalImageRow.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'; // Assuming you still want to use next/image for optimization

interface DiagonalImageRowProps {
  images: string[];   // Array of image URLs to display in the row
  xOffset: string;    // How much the row moves horizontally (e.g., "-20vw", "300px")
  yOffset: string;    // How much the row moves vertically (e.g., "50px", "-10vh")
  rowHeight?: string; // Optional: custom height for the row (e.g., "h-48", "h-[100px]")
}

const DiagonalImageRow: React.FC<DiagonalImageRowProps> = ({
  images,
  xOffset,
  yOffset,
  rowHeight = 'h-48', // Default height if not provided
}) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the row's visible container

  // useScroll hook to track scroll position relative to THIS row's container.
  // The animation plays as the row enters ('start end') and leaves ('end start') the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // X transform: As scrollYProgress goes from 0 to 1, x moves from 0px to xOffset.
  const x = useTransform(scrollYProgress, [0, 1], [`0px`, xOffset]);

  // Y transform: As scrollYProgress goes from 0 to 1, y moves from 0px to yOffset.
  const y = useTransform(scrollYProgress, [0, 1], [`0px`, yOffset]);
const src = '/paintedimage.png'; // Example image source, replace with your actual image URL
  return (
    <div
      ref={containerRef} // Attach ref to the outer container for scroll tracking
      className={`relative w-full ${rowHeight} flex items-center overflow-hidden`}
      // The `overflow-hidden` is crucial to clip the images as they move
      // outside the row's defined height/width during the diagonal motion.
    >
      <motion.div
        className="flex flex-row flex-nowrap justify-around" // `flex-nowrap` prevents wrapping, `justify-around` distributes images
        style={{ x, y }} // Apply the dynamic X and Y transforms
      >
        {images.map((src, index) => (
          <div key={index} className="relative h-full aspect-video flex-shrink-0 mx-2">
            {/* Using a wrapper div for next/image with 'fill' for better control */}
            <Image
              src={src}
              alt={`Diagonal Image ${index}`}
              fill // Makes the image cover its parent div
              className="object-cover" // Ensures the image fills the space without distortion
              sizes="300px" // Optimized for typical image size in this row
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default DiagonalImageRow;