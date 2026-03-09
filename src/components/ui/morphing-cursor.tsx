"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MagneticTextProps {
  text: string
  hoverText?: string
  className?: string
  circleSize?: number
}

export function MagneticText({ text = "CREATIVE", hoverText, className, circleSize = 250 }: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const innerTextRef = useRef<HTMLSpanElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [containerCenter, setContainerCenter] = useState({ x: 0, y: 0 })

  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        setContainerCenter({
          x: containerRef.current.offsetWidth / 2,
          y: containerRef.current.offsetHeight / 2,
        })
      }
    }
    updateCenter()
    window.addEventListener("resize", updateCenter)
    return () => window.removeEventListener("resize", updateCenter)
  }, [])

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.12)
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.12)

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`
      }

      if (innerTextRef.current) {
        // Counter-translate to keep text aligned with container center
        const offsetX = containerCenter.x - currentPos.current.x
        const offsetY = containerCenter.y - currentPos.current.y
        innerTextRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [containerCenter])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mousePos.current = { x, y }
    currentPos.current = { x, y }
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const displayHoverText = hoverText || text

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center overflow-hidden cursor-none select-none",
        className
      )}
    >
      {/* Base text layer - dim */}
      <span
        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
        style={{ color: "rgba(255,255,255,0.12)" }}
      >
        {text}
      </span>

      {/* White circle with black text */}
      <div
        ref={circleRef}
        className={cn(
          "absolute top-0 left-0 pointer-events-none transition-all duration-300 ease-out",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
        style={{
          width: circleSize,
          height: circleSize,
          willChange: "transform",
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
        >
          <span
            ref={innerTextRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter whitespace-nowrap"
            style={{ 
              color: "#000000",
              willChange: "transform",
            }}
          >
            {displayHoverText}
          </span>
        </div>
      </div>
    </div>
  )
}
