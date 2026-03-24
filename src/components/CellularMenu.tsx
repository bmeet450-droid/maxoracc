import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const menuData = [
  { id: "1", label: "Project 1" },
  { id: "2", label: "Project 2" },
];

const CIRCLE_SIZE = 180;
const EXPANDED_GAP = 40;

const CellularMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 400);
  }, []);

  return (
    <div className="flex items-center justify-center py-20 md:py-32">
      {/* Hidden SVG filter for gooey effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{
          minHeight: CIRCLE_SIZE + 60,
          minWidth: CIRCLE_SIZE * 3,
          filter: "url(#goo-filter)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main circle (visible when collapsed) */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
          animate={{
            scale: isExpanded ? 0.4 : 1,
            opacity: isExpanded ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-black">
            Explore
          </span>
        </motion.div>

        {/* Left child */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
          animate={{
            x: isExpanded ? -(CIRCLE_SIZE / 2 + EXPANDED_GAP / 2) : 0,
            scale: isExpanded ? 1 : 0.2,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-neutral-300" />
            <span className="text-[10px] font-medium tracking-widest uppercase text-black/60">
              {menuData[0].label}
            </span>
          </div>
        </motion.div>

        {/* Right child */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
          animate={{
            x: isExpanded ? (CIRCLE_SIZE / 2 + EXPANDED_GAP / 2) : 0,
            scale: isExpanded ? 1 : 0.2,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: isExpanded ? 0.05 : 0 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-neutral-300" />
            <span className="text-[10px] font-medium tracking-widest uppercase text-black/60">
              {menuData[1].label}
            </span>
          </div>
        </motion.div>

        {/* Bridge blob for gooey connection */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: CIRCLE_SIZE * 0.6,
            height: CIRCLE_SIZE * 0.6,
            backgroundColor: "#ffffff",
          }}
          animate={{
            scaleX: isExpanded ? 3.5 : 0.5,
            scaleY: isExpanded ? 0.6 : 0.5,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
        />
      </div>
    </div>
  );
};

export default CellularMenu;
