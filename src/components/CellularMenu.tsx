import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import vedasImg from "@/assets/project-vedas.jpeg";
import logoImg from "@/assets/project-logo.png";

const menuData = [
  {
    id: "1", label: "Bayshore Tiles Boutique", image: vedasImg,
    link: "https://bayshoretiles.com/",
    description: "Premium tile boutique with curated collections",
  },
  { id: "2", label: "Project 2", image: null, link: null, description: "" },
  {
    id: "3", label: "Maxora", image: logoImg,
    link: "https://maxora.cc/",
    description: "Creative agency crafting digital experiences",
  },
];

const CIRCLE_SIZE = 180;
const VISIT_SIZE = 100;
const DESC_SIZE = 180;
const EXPANDED_GAP = 50;

// Visit bubbles go downward, description bubbles go upward — balanced symmetry
const bubbleOffsets = {
  left: {
    visit: { angle: -135, distance: CIRCLE_SIZE * 0.95 },
    desc:  { angle: 135, distance: CIRCLE_SIZE * 0.95 },
  },
  right: {
    visit: { angle: -45, distance: CIRCLE_SIZE * 0.95 },
    desc:  { angle: 45, distance: CIRCLE_SIZE * 0.95 },
  },
};

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const getOffsetXY = (angleDeg: number, dist: number) => ({
  x: Math.cos((angleDeg * Math.PI) / 180) * dist,
  y: -Math.sin((angleDeg * Math.PI) / 180) * dist,
});

// Helper to render a goo bubble + bridge pair
const GooBubble = ({
  isVisible,
  parentX,
  offset,
  size,
}: {
  isVisible: boolean;
  parentX: number;
  offset: { x: number; y: number };
  size: number;
}) => (
  <>
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: "white",
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
      }}
      animate={{
        x: isVisible ? parentX + offset.x : parentX,
        y: isVisible ? offset.y : 0,
        scale: isVisible ? 1 : 0.2,
        opacity: isVisible ? 1 : 0,
      }}
      transition={springTransition}
    />
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size * 0.5,
        height: size * 0.5,
        backgroundColor: "white",
        top: "50%",
        left: "50%",
        marginTop: -size * 0.25,
        marginLeft: -size * 0.25,
      }}
      animate={{
        x: isVisible ? parentX + offset.x * 0.45 : parentX,
        y: isVisible ? offset.y * 0.45 : 0,
        scaleX: isVisible ? 2 : 0.3,
        scaleY: isVisible ? 0.6 : 0.3,
        opacity: isVisible ? 1 : 0,
      }}
      transition={springTransition}
    />
  </>
);

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

  const leftVisitOff = getOffsetXY(bubbleOffsets.left.visit.angle, bubbleOffsets.left.visit.distance);
  const leftDescOff = getOffsetXY(bubbleOffsets.left.desc.angle, bubbleOffsets.left.desc.distance);
  const rightVisitOff = getOffsetXY(bubbleOffsets.right.visit.angle, bubbleOffsets.right.visit.distance);
  const rightDescOff = getOffsetXY(bubbleOffsets.right.desc.angle, bubbleOffsets.right.desc.distance);

  const isLeftHovered = isExpanded && hoveredChild === "left";
  const isRightHovered = isExpanded && hoveredChild === "right";

  return (
    <div className="flex items-center justify-center py-20 md:py-32">
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -16" result="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{ minHeight: CIRCLE_SIZE * 3, minWidth: CIRCLE_SIZE * 5 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* GOO LAYER */}
        <div className="absolute inset-0 pointer-events-none" style={{ filter: "url(#goo-filter)" }}>
          {/* Center goo */}
          <motion.div className="absolute rounded-full" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "white", top: "50%", left: "50%", marginTop: -CIRCLE_SIZE / 2, marginLeft: -CIRCLE_SIZE / 2 }}
            animate={{ scale: isExpanded ? 0.85 : 1 }} transition={springTransition} />
          {/* Left goo */}
          <motion.div className="absolute rounded-full" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "white", top: "50%", left: "50%", marginTop: -CIRCLE_SIZE / 2, marginLeft: -CIRCLE_SIZE / 2 }}
            animate={{ x: isExpanded ? -totalSpread : 0, scale: isExpanded ? 1 : 0.2, opacity: isExpanded ? 1 : 0 }} transition={springTransition} />
          {/* Right goo */}
          <motion.div className="absolute rounded-full" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, backgroundColor: "white", top: "50%", left: "50%", marginTop: -CIRCLE_SIZE / 2, marginLeft: -CIRCLE_SIZE / 2 }}
            animate={{ x: isExpanded ? totalSpread : 0, scale: isExpanded ? 1 : 0.2, opacity: isExpanded ? 1 : 0 }} transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }} />
          {/* Left bridge */}
          <motion.div className="absolute rounded-full" style={{ width: CIRCLE_SIZE * 0.45, height: CIRCLE_SIZE * 0.45, backgroundColor: "white", top: "50%", left: "50%", marginTop: -(CIRCLE_SIZE * 0.45) / 2, marginLeft: -(CIRCLE_SIZE * 0.45) / 2 }}
            animate={{ x: isExpanded ? -(totalSpread * 0.35) : 0, scaleX: isExpanded ? 2.8 : 0.5, scaleY: isExpanded ? 0.7 : 0.5, opacity: isExpanded ? 1 : 0 }} transition={springTransition} />
          {/* Right bridge */}
          <motion.div className="absolute rounded-full" style={{ width: CIRCLE_SIZE * 0.45, height: CIRCLE_SIZE * 0.45, backgroundColor: "white", top: "50%", left: "50%", marginTop: -(CIRCLE_SIZE * 0.45) / 2, marginLeft: -(CIRCLE_SIZE * 0.45) / 2 }}
            animate={{ x: isExpanded ? totalSpread * 0.35 : 0, scaleX: isExpanded ? 2.8 : 0.5, scaleY: isExpanded ? 0.7 : 0.5, opacity: isExpanded ? 1 : 0 }} transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }} />

          {/* Left visit + desc goo bubbles */}
          <GooBubble isVisible={isLeftHovered} parentX={-totalSpread} offset={leftVisitOff} size={VISIT_SIZE} />
          <GooBubble isVisible={isLeftHovered} parentX={-totalSpread} offset={leftDescOff} size={DESC_SIZE} />

          {/* Right visit + desc goo bubbles */}
          <GooBubble isVisible={isRightHovered} parentX={totalSpread} offset={rightVisitOff} size={VISIT_SIZE} />
          <GooBubble isVisible={isRightHovered} parentX={totalSpread} offset={rightDescOff} size={DESC_SIZE} />
        </div>

        {/* CONTENT LAYER */}

        {/* Center circle */}
        <motion.div className="absolute rounded-full flex items-center justify-center overflow-hidden z-10"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, border: "2px solid rgba(255,255,255,0.6)" }}
          animate={{ scale: isExpanded ? 0.85 : 1 }} transition={springTransition}>
          {menuData[1].image ? (
            <img src={menuData[1].image} alt={menuData[1].label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold tracking-widest uppercase text-black">Explore</span>
          )}
        </motion.div>

        {/* Left child */}
        <motion.div className="absolute rounded-full flex items-center justify-center overflow-hidden z-10"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, border: "2px solid rgba(255,255,255,0.6)" }}
          animate={{ x: isExpanded ? -totalSpread : 0, scale: isExpanded ? 1 : 0.2, opacity: isExpanded ? 1 : 0 }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("left")}
          onMouseLeave={() => setHoveredChild(null)}>
          <div className="w-full h-full relative">
            {menuData[0].image ? (
              <img src={menuData[0].image} alt={menuData[0].label} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="w-full h-full bg-neutral-300" />
            )}
          </div>
        </motion.div>

        {/* Left visit bubble */}
        <motion.a href={menuData[0].link || "#"} target="_blank" rel="noopener noreferrer"
          className="absolute rounded-full flex items-center justify-center z-20"
          style={{ width: VISIT_SIZE, height: VISIT_SIZE }}
          animate={{
            x: isLeftHovered ? -totalSpread + leftVisitOff.x : -totalSpread,
            y: isLeftHovered ? leftVisitOff.y : 0,
            scale: isLeftHovered ? 1 : 0.2,
            opacity: isLeftHovered ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("left")}>
          <span className="text-xs font-bold tracking-widest uppercase text-black">Visit</span>
        </motion.a>

        {/* Left description bubble */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center z-20 p-3"
          style={{ width: DESC_SIZE, height: DESC_SIZE }}
          animate={{
            x: isLeftHovered ? -totalSpread + leftDescOff.x : -totalSpread,
            y: isLeftHovered ? leftDescOff.y : 0,
            scale: isLeftHovered ? 1 : 0.2,
            opacity: isLeftHovered ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("left")}>
          <span className="text-sm font-medium leading-snug text-center text-black/80">
            {menuData[0].description}
          </span>
        </motion.div>

        {/* Right child */}
        <motion.div className="absolute rounded-full flex items-center justify-center overflow-hidden z-10"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, border: "2px solid rgba(255,255,255,0.6)" }}
          animate={{ x: isExpanded ? totalSpread : 0, scale: isExpanded ? 1 : 0.2, opacity: isExpanded ? 1 : 0 }}
          transition={{ ...springTransition, delay: isExpanded ? 0.05 : 0 }}
          onMouseEnter={() => setHoveredChild("right")}
          onMouseLeave={() => setHoveredChild(null)}>
          <div className="w-full h-full relative">
            {menuData[2].image ? (
              <img src={menuData[2].image} alt={menuData[2].label} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className="w-full h-full bg-neutral-300" />
            )}
          </div>
        </motion.div>

        {/* Right visit bubble */}
        <motion.a href={menuData[2].link || "#"} target="_blank" rel="noopener noreferrer"
          className="absolute rounded-full flex items-center justify-center z-20"
          style={{ width: VISIT_SIZE, height: VISIT_SIZE }}
          animate={{
            x: isRightHovered ? totalSpread + rightVisitOff.x : totalSpread,
            y: isRightHovered ? rightVisitOff.y : 0,
            scale: isRightHovered ? 1 : 0.2,
            opacity: isRightHovered ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("right")}>
          <span className="text-xs font-bold tracking-widest uppercase text-black">Visit</span>
        </motion.a>

        {/* Right description bubble */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center z-20 p-3"
          style={{ width: DESC_SIZE, height: DESC_SIZE }}
          animate={{
            x: isRightHovered ? totalSpread + rightDescOff.x : totalSpread,
            y: isRightHovered ? rightDescOff.y : 0,
            scale: isRightHovered ? 1 : 0.2,
            opacity: isRightHovered ? 1 : 0,
          }}
          transition={springTransition}
          onMouseEnter={() => setHoveredChild("right")}>
          <span className="text-sm font-medium leading-snug text-center text-black/80">
            {menuData[2].description}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default CellularMenu;
