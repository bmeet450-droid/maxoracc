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
  const clipRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.12)
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.12)

      if (clipRef.current) {
        const r = isHovered ? circleSize / 2 : 0
        clipRef.current.style.clipPath = `circle(${r}px at ${currentPos.current.x}px ${currentPos.current.y}px)`
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isHovered, circleSize])

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

      {/* Masked overlay - bright text revealed by circle */}
      <div
        ref={clipRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          clipPath: "circle(0px at 0px 0px)",
          transition: isHovered ? "none" : "clip-path 0.5s ease-out",
          willChange: "clip-path",
        }}
      >
        <span
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter"
          style={{ color: "rgba(255,255,255,1)" }}
        >
          {displayHoverText}
        </span>
      </div>
    </div>
  )
}
