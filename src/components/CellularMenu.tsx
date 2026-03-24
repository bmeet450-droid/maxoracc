import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import vedasImg from "@/assets/project-vedas.jpeg";
import logoImg from "@/assets/project-logo.png";

const menuData = [
  { id: "1", label: "Vedas", image: vedasImg, link: "https://example.com/vedas" },
  { id: "2", label: "Project 2", image: null, link: null },
  { id: "3", label: "Logo", image: logoImg, link: "https://example.com/logo" },
];

const CIRCLE_SIZE = 180;
const VISIT_SIZE = 100;
const EXPANDED_GAP = 50;

// Each child gets a fixed "visit" bubble direction (angle in degrees, distance)
const visitOffsets = {
  left: { angle: -120, distance: CIRCLE_SIZE * 0.75 },   // bottom-left
  right: { angle: -60, distance: CIRCLE_SIZE * 0.75 },    // bottom-right
};

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const getOffsetXY = (angleDeg: number, dist: number) => ({
  x: Math.cos((angleDeg * Math.PI) / 180) * dist,
  y: -Math.sin((angleDeg * Math.PI) / 180) * dist,
});

const CellularMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredChild, setHoveredChild] = useState<"left" | "right" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      setHoveredChild(null);
    }, 600);
  }, []);

  const totalSpread = CIRCLE_SIZE + EXPANDED_GAP;

  const leftVisit = getOffsetXY(visitOffsets.left.angle, visitOffsets.left.distance);
  const rightVisit = getOffsetXY(visitOffsets.right.angle, visitOffsets.right.distance);

  const isLeftVisitVisible = isExpanded && hoveredChild === "left";
  const isRightVisitVisible = isExpanded && hoveredChild === "right";

  return (
    <div className="flex items-center justify-center py-20 md:py-32">
      {/* SVG goo filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -16"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{
          minHeight: CIRCLE_SIZE * 2.5,
          minWidth: CIRCLE_SIZE * 5,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* GOO LAYER */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ filter: "url(#goo-filter)" }}
        >
          {/* Center goo circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -CIRCLE_SIZE / 2,
              marginLeft: -CIRCLE_SIZE / 2,
            }}
            animate={{ scale: isExpanded ? 0.85 : 1 }}
            transition={springTransition}
          />
          {/* Left goo circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -CIRCLE_SIZE / 2,
              marginLeft: -CIRCLE_SIZE / 2,
            }}
            animate={{
              x: isExpanded ? -totalSpread : 0,
              scale: isExpanded ? 1 : 0.2,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={springTransition}
          />
          {/* Right goo circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -CIRCLE_SIZE / 2,
              marginLeft: -CIRCLE_SIZE / 2,
            }}
            animate={{
              x: isExpanded ? totalSpread : 0,
              scale: isExpanded ? 1 : 0.2,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }}
          />

          {/* Left bridge connector */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: CIRCLE_SIZE * 0.45,
              height: CIRCLE_SIZE * 0.45,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -(CIRCLE_SIZE * 0.45) / 2,
              marginLeft: -(CIRCLE_SIZE * 0.45) / 2,
            }}
            animate={{
              x: isExpanded ? -(totalSpread * 0.35) : 0,
              scaleX: isExpanded ? 2.8 : 0.5,
              scaleY: isExpanded ? 0.7 : 0.5,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={springTransition}
          />
          {/* Right bridge connector */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: CIRCLE_SIZE * 0.45,
              height: CIRCLE_SIZE * 0.45,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -(CIRCLE_SIZE * 0.45) / 2,
              marginLeft: -(CIRCLE_SIZE * 0.45) / 2,
            }}
            animate={{
              x: isExpanded ? totalSpread * 0.35 : 0,
              scaleX: isExpanded ? 2.8 : 0.5,
              scaleY: isExpanded ? 0.7 : 0.5,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }}
          />

          {/* Left visit goo circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: VISIT_SIZE,
              height: VISIT_SIZE,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -VISIT_SIZE / 2,
              marginLeft: -VISIT_SIZE / 2,
            }}
            animate={{
              x: isLeftVisitVisible ? -totalSpread + leftVisit.x : -totalSpread,
              y: isLeftVisitVisible ? leftVisit.y : 0,
              scale: isLeftVisitVisible ? 1 : 0.2,
              opacity: isLeftVisitVisible ? 1 : 0,
            }}
            transition={springTransition}
          />
          {/* Left visit bridge */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: VISIT_SIZE * 0.5,
              height: VISIT_SIZE * 0.5,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -VISIT_SIZE * 0.25,
              marginLeft: -VISIT_SIZE * 0.25,
            }}
            animate={{
              x: isLeftVisitVisible ? -totalSpread + leftVisit.x * 0.45 : -totalSpread,
              y: isLeftVisitVisible ? leftVisit.y * 0.45 : 0,
              scaleX: isLeftVisitVisible ? 2 : 0.3,
              scaleY: isLeftVisitVisible ? 0.6 : 0.3,
              rotate: isLeftVisitVisible ? visitOffsets.left.angle + 180 : 0,
              opacity: isLeftVisitVisible ? 1 : 0,
            }}
            transition={springTransition}
          />

          {/* Right visit goo circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: VISIT_SIZE,
              height: VISIT_SIZE,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -VISIT_SIZE / 2,
              marginLeft: -VISIT_SIZE / 2,
            }}
            animate={{
              x: isRightVisitVisible ? totalSpread + rightVisit.x : totalSpread,
              y: isRightVisitVisible ? rightVisit.y : 0,
              scale: isRightVisitVisible ? 1 : 0.2,
              opacity: isRightVisitVisible ? 1 : 0,
            }}
            transition={springTransition}
          />
          {/* Right visit bridge */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: VISIT_SIZE * 0.5,
              height: VISIT_SIZE * 0.5,
              backgroundColor: "white",
              top: "50%",
              left: "50%",
              marginTop: -VISIT_SIZE * 0.25,
              marginLeft: -VISIT_SIZE * 0.25,
            }}
            animate={{
              x: isRightVisitVisible ? totalSpread + rightVisit.x * 0.45 : totalSpread,
              y: isRightVisitVisible ? rightVisit.y * 0.45 : 0,
              scaleX: isRightVisitVisible ? 2 : 0.3,
              scaleY: isRightVisitVisible ? 0.6 : 0.3,
              rotate: isRightVisitVisible ? -visitOffsets.right.angle : 0,
              opacity: isRightVisitVisible ? 1 : 0,
            }}
            transition={springTransition}
          />
        </div>

        {/* CONTENT LAYER */}

        {/* Center circle */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden z-10"
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            border: "2px solid rgba(255,255,255,0.6)",
          }}
          animate={{ scale: isExpanded ? 0.85 : 1 }}
          transition={springTransition}
        >
          {menuData[1].image ? (
            <img src={menuData[1].image} alt={menuData[1].label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold tracking-widest uppercase text-black">
              Explore
            </span>
          )}
        </motion.div>

        {/* Left child */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden z-10"
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            border: "2px solid rgba(255,255,255,0.6)",
          }}
          animate={{
            x: isExpanded ? -totalSpread : 0,
            scale: isExpanded ? 1 : 0.2,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("left")}
          onMouseLeave={() => setHoveredChild(null)}
        >
          <div className="w-full h-full relative">
            {menuData[0].image ? (
              <img src={menuData[0].image} alt={menuData[0].label} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="w-full h-full bg-neutral-300" />
            )}
            <span className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-medium tracking-widest uppercase text-white/80 drop-shadow-lg">
              {menuData[0].label}
            </span>
          </div>
        </motion.div>

        {/* Left visit content circle */}
        <motion.a
          href={menuData[0].link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute rounded-full flex items-center justify-center z-20"
          style={{
            width: VISIT_SIZE,
            height: VISIT_SIZE,
          }}
          animate={{
            x: isLeftVisitVisible ? -totalSpread + leftVisit.x : -totalSpread,
            y: isLeftVisitVisible ? leftVisit.y : 0,
            scale: isLeftVisitVisible ? 1 : 0.2,
            opacity: isLeftVisitVisible ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("left")}
        >
          <span className="text-xs font-bold tracking-widest uppercase text-black">
            Visit
          </span>
        </motion.a>

        {/* Right child */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center overflow-hidden z-10"
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            border: "2px solid rgba(255,255,255,0.6)",
          }}
          animate={{
            x: isExpanded ? totalSpread : 0,
            scale: isExpanded ? 1 : 0.2,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }}
          onMouseEnter={() => setHoveredChild("right")}
          onMouseLeave={() => setHoveredChild(null)}
        >
          <div className="w-full h-full relative">
            {menuData[2].image ? (
              <img src={menuData[2].image} alt={menuData[2].label} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="w-full h-full bg-neutral-300" />
            )}
            <span className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-medium tracking-widest uppercase text-white/80 drop-shadow-lg">
              {menuData[2].label}
            </span>
          </div>
        </motion.div>

        {/* Right visit content circle */}
        <motion.a
          href={menuData[2].link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute rounded-full flex items-center justify-center z-20"
          style={{
            width: VISIT_SIZE,
            height: VISIT_SIZE,
          }}
          animate={{
            x: isRightVisitVisible ? totalSpread + rightVisit.x : totalSpread,
            y: isRightVisitVisible ? rightVisit.y : 0,
            scale: isRightVisitVisible ? 1 : 0.2,
            opacity: isRightVisitVisible ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("right")}
        >
          <span className="text-xs font-bold tracking-widest uppercase text-black">
            Visit
          </span>
        </motion.a>
      </div>
    </div>
  );
};

export default CellularMenu;
