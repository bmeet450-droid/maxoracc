'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const positions = [
    '', // index 0: center/main
    '-top-[30vh] left-[5vw] h-[30vh] w-[35vw]',
    '-top-[10vh] -left-[25vw] h-[45vh] w-[20vw]',
    'left-[27.5vw] h-[25vh] w-[25vw]',
    'top-[27.5vh] left-[5vw] h-[25vh] w-[20vw]',
    'top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw]',
    'top-[22.5vh] left-[25vw] h-[15vh] w-[15vw]',
  ];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            >
              <div
                className={`relative ${
                  index === 0
                    ? 'h-[25vh] w-[25vw]'
                    : positions[index] || ''
                }`}
              >
                <img
                  src={src}
                  alt={alt || `Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
