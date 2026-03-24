import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CellNode {
  id: string;
  label: string;
  image?: string;
  children?: CellNode[];
}

const menuData: CellNode[] = [
  { id: "1", label: "Project 1" },
  { id: "2", label: "Project 2" },
];

const CIRCLE_SIZE = 160;
const EXPANDED_GAP = 100;

const CellularMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 300);
  }, []);

  return (
    <div className="flex items-center justify-center py-20 md:py-32">
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ minHeight: CIRCLE_SIZE + 40, minWidth: CIRCLE_SIZE * 3 + EXPANDED_GAP }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* SVG connector blob */}
        <AnimatePresence>
          {isExpanded && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
              viewBox={`0 0 ${CIRCLE_SIZE * 3 + EXPANDED_GAP} ${CIRCLE_SIZE + 40}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                    result="goo"
                  />
                  <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
              </defs>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Goo filter container */}
        <div
          className="relative flex items-center justify-center"
          style={{ filter: "url(#goo-main)" }}
        >
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="goo-main">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>

          {/* Main circle */}
          <motion.div
            className="absolute rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              backgroundColor: "hsl(var(--foreground) / 0.08)",
              border: "1px solid hsl(var(--foreground) / 0.12)",
            }}
            animate={{
              x: isExpanded ? 0 : 0,
              scale: isExpanded ? 0.6 : 1,
              opacity: isExpanded ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-full"
                style={{ backgroundColor: "hsl(var(--foreground) / 0.15)" }}
              />
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{ color: "hsl(var(--foreground) / 0.5)" }}
              >
                Explore
              </span>
            </div>
          </motion.div>

          {/* Left child circle */}
          <motion.div
            className="absolute rounded-full flex items-center justify-center cursor-pointer overflow-hidden group"
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              backgroundColor: "hsl(var(--foreground) / 0.06)",
              border: "1px solid hsl(var(--foreground) / 0.1)",
            }}
            animate={{
              x: isExpanded ? -(CIRCLE_SIZE / 2 + EXPANDED_GAP / 2) : 0,
              scale: isExpanded ? 1 : 0.3,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20, delay: isExpanded ? 0.05 : 0 }}
          >
            {/* Photo placeholder */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: "hsl(var(--foreground) / 0.12)" }}
              />
              <span
                className="absolute bottom-6 text-xs font-medium tracking-wider uppercase"
                style={{ color: "hsl(var(--foreground) / 0.4)" }}
              >
                {menuData[0].label}
              </span>
            </div>
          </motion.div>

          {/* Right child circle */}
          <motion.div
            className="absolute rounded-full flex items-center justify-center cursor-pointer overflow-hidden group"
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              backgroundColor: "hsl(var(--foreground) / 0.06)",
              border: "1px solid hsl(var(--foreground) / 0.1)",
            }}
            animate={{
              x: isExpanded ? (CIRCLE_SIZE / 2 + EXPANDED_GAP / 2) : 0,
              scale: isExpanded ? 1 : 0.3,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20, delay: isExpanded ? 0.1 : 0 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: "hsl(var(--foreground) / 0.12)" }}
              />
              <span
                className="absolute bottom-6 text-xs font-medium tracking-wider uppercase"
                style={{ color: "hsl(var(--foreground) / 0.4)" }}
              >
                {menuData[1].label}
              </span>
            </div>
          </motion.div>

          {/* Connector bridge blob (visible during expansion) */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: CIRCLE_SIZE * 0.5,
              height: CIRCLE_SIZE * 0.5,
              backgroundColor: "hsl(var(--foreground) / 0.06)",
            }}
            animate={{
              scaleX: isExpanded ? 3 : 0.5,
              scaleY: isExpanded ? 0.7 : 0.5,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
};

export default CellularMenu;
