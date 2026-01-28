import { useEffect, useState } from "react";
import cursorImage from "@/assets/cursor.png";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor-hover]'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', updateCursor);
    
    // Initial setup and observe for new elements
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      observer.disconnect();
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      <style>{`
        * { cursor: none !important; }
      `}</style>
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <img
          src={cursorImage}
          alt=""
          className="absolute transition-all duration-200 ease-out"
          style={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
