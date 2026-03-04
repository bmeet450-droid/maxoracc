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
    '-top-[36vh] left-[3vw] h-[18vh] w-[35vw] md:-top-[30vh] md:h-[30vh] md:w-[35vw]',
    '-top-[16vh] -left-[32vw] h-[18vh] w-[30vw] md:-top-[10vh] md:-left-[25vw] md:h-[45vh] md:w-[20vw]',
    '-top-[16vh] left-[28vw] h-[18vh] w-[30vw] md:top-0 md:left-[27.5vw] md:h-[25vh] md:w-[25vw]',
    'top-[22vh] left-[24vw] h-[18vh] w-[30vw] md:top-[27.5vh] md:left-[5vw] md:h-[25vh] md:w-[20vw]',
    'top-[22vh] -left-[32vw] h-[18vh] w-[30vw] md:top-[27.5vh] md:-left-[22.5vw] md:h-[25vh] md:w-[30vw]',
    'top-[40vh] left-[22vw] h-[15vh] w-[25vw] md:top-[22.5vh] md:left-[25vw] md:h-[15vh] md:w-[15vw]',
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
                    ? 'h-[25vh] w-[40vw] md:h-[25vh] md:w-[25vw]'
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
