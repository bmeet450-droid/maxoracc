'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsLowEndDevice(lowMemory || lowCpu || reducedMotion);
  }, []);

  const liteMode = isMobile || isLowEndDevice;

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scaleA = useTransform(scrollYProgress, [0, 1], [1, liteMode ? 1.8 : 2.8]);
  const scaleB = useTransform(scrollYProgress, [0, 1], [1, liteMode ? 2.1 : 3.6]);
  const scaleC = useTransform(scrollYProgress, [0, 1], [1, liteMode ? 2.4 : 4.2]);
  const scaleD = useTransform(scrollYProgress, [0, 1], [1, liteMode ? 2.7 : 5]);

  const scales = useMemo(() => [scaleA, scaleB, scaleC, scaleB, scaleC, scaleD, scaleD], [scaleA, scaleB, scaleC, scaleD]);

  const positions = [
    '', // index 0: center/main
    '-top-[30vh] left-[5vw] h-[30vh] w-[35vw]',
    '-top-[10vh] -left-[30vw] h-[45vh] w-[20vw]',
    'left-[30vw] h-[25vh] w-[25vw]',
    'top-[30vh] left-[5vw] h-[25vh] w-[20vw]',
    'top-[30vh] -left-[27vw] h-[25vh] w-[28vw]',
    'top-[27vh] left-[30vw] h-[15vh] w-[15vw]',
  ];

  const activeImages = liteMode ? images.slice(0, 4) : images;

  return (
    <div ref={container} className={`relative ${liteMode ? 'h-[220vh]' : 'h-[260vh]'}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {activeImages.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute inset-0 flex items-center justify-center will-change-transform [transform:translateZ(0)]"
            >
              <div
                className={`relative ${
                  index === 0
                    ? `${liteMode ? 'h-[22vh] w-[30vw]' : 'h-[25vh] w-[25vw]'}`
                    : positions[index] || ''
                }`}
              >
                <img
                  src={src}
                  alt={alt || `Image ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  draggable={false}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
