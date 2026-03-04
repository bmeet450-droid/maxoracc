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
    '', // index 0: center/main — largest
    '-top-[34vh] left-[2vw] h-[22vh] w-[38vw] md:-top-[28vh] md:left-[5vw] md:h-[32vh] md:w-[38vw]', // large
    '-top-[12vh] -left-[34vw] h-[16vh] w-[28vw] md:-top-[8vh] md:-left-[25vw] md:h-[22vh] md:w-[20vw]',
    '-top-[12vh] left-[30vw] h-[16vh] w-[28vw] md:-top-[2vh] md:left-[28vw] md:h-[22vh] md:w-[20vw]',
    'top-[18vh] left-[26vw] h-[22vh] w-[36vw] md:top-[24vh] md:left-[8vw] md:h-[30vh] md:w-[28vw]', // large
    'top-[18vh] -left-[34vw] h-[16vh] w-[28vw] md:top-[24vh] md:-left-[24vw] md:h-[22vh] md:w-[22vw]',
    'top-[38vh] left-[20vw] h-[14vh] w-[24vw] md:top-[20vh] md:left-[28vw] md:h-[16vh] md:w-[16vw]',
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
