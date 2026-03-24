'use client';

import React, { useRef, useId, useEffect, CSSProperties } from 'react';
import { animate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimationConfig {
  scale: number;
  speed: number;
}

interface NoiseConfig {
  opacity: number;
  scale: number;
}

interface EtheralShadowProps {
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

function mapRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  if (fromLow === fromHigh) return toLow;
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

export function EtheralShadow({
  color = 'rgba(128, 128, 128, 1)',
  animation,
  noise,
  style,
  className,
  children,
}: EtheralShadowProps) {
  const rawId = useId();
  const id = `etheral-${rawId.replace(/:/g, '')}`;
  const animationEnabled = animation && animation.scale > 0;
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotateMotionValue = useMotionValue(0);
  const hueRotateAnimation = useRef<ReturnType<typeof animate> | null>(null);

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      if (hueRotateAnimation.current) {
        hueRotateAnimation.current.stop();
      }
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        ease: 'linear',
        delay: 0,
        onUpdate: (value: number) => {
          if (feColorMatrixRef.current) {
            feColorMatrixRef.current.setAttribute('values', String(value));
          }
        },
      });

      return () => {
        if (hueRotateAnimation.current) {
          hueRotateAnimation.current.stop();
        }
      };
    }
  }, [animationEnabled, animationDuration, hueRotateMotionValue]);

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden', className)}
      style={style}
    >
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={`${id}-shadow-filter`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              seed="1"
              result="noise"
            />
            <feColorMatrix
              ref={feColorMatrixRef}
              in="noise"
              type="hueRotate"
              values="0"
              result="rotatedNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="rotatedNoise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
          {noise && noise.opacity > 0 && (
            <filter id={`${id}-noise-filter`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.65 * (noise.scale || 1)}
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
          )}
        </defs>
      </svg>

      {/* Shadow layer */}
      <div
        className="absolute inset-0"
        style={
          animationEnabled
            ? { filter: `url(#${id}-shadow-filter)` }
            : undefined
        }
      >
        <div
          className="absolute inset-[-20%]"
          style={{
            background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Noise overlay */}
      {noise && noise.opacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: `url(#${id}-noise-filter)`,
            opacity: noise.opacity,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Children */}
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
}
