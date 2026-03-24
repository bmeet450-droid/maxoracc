import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import vedasImg from "@/assets/project-vedas.jpeg";
import logoImg from "@/assets/project-logo.png";

const menuData = [
  { id: "1", image: vedasImg },
  { id: "2", image: null },
  { id: "3", image: logoImg },
];

const CIRCLE_SIZE = 180;
const EXPANDED_GAP = 30;

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const CellularMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 600);
  }, []);

  const totalSpread = CIRCLE_SIZE + EXPANDED_GAP;

  return (
    <div className="flex items-center justify-center py-20 md:py-32">
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
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
          minWidth: CIRCLE_SIZE * 4,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Goo morphing layer - all three circles connect organically */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ filter: "url(#goo-filter)" }}
        >
          {/* Center goo blob */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
            animate={{ scale: isExpanded ? 0.85 : 1 }}
            transition={springTransition}
          />
          {/* Left goo blob */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
            animate={{
              x: isExpanded ? -totalSpread : 0,
              scale: isExpanded ? 1 : 0.2,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={springTransition}
          />
          {/* Right goo blob */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
            animate={{
              x: isExpanded ? totalSpread : 0,
              scale: isExpanded ? 1 : 0.2,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }}
          />
        </div>

        {/* Visual center circle (on top, no filter) */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "#ffffff" }}
          animate={{ scale: isExpanded ? 0.85 : 1 }}
          transition={springTransition}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-black">
            Explore
          </span>
        </motion.div>

        {/* Left child - visual layer with image */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: CIRCLE_SIZE - 12,
            height: CIRCLE_SIZE - 12,
            border: "3px solid rgba(255,255,255,0.8)",
          }}
          animate={{
            x: isExpanded ? -totalSpread : 0,
            scale: isExpanded ? 1 : 0.2,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={springTransition}
        >
          {menuData[0].image && (
            <img src={menuData[0].image} alt="Project" className="w-full h-full object-cover" />
          )}
        </motion.div>

        {/* Right child - visual layer with image */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: CIRCLE_SIZE - 12,
            height: CIRCLE_SIZE - 12,
            border: "3px solid rgba(255,255,255,0.8)",
          }}
          animate={{
            x: isExpanded ? totalSpread : 0,
            scale: isExpanded ? 1 : 0.2,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }}
        >
          {menuData[2].image && (
            <img src={menuData[2].image} alt="Project" className="w-full h-full object-cover" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CellularMenu;
