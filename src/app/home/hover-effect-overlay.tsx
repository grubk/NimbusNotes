"use client"

import { motion } from "framer-motion"

interface HoverEffectOverlayProps {
  hovered: boolean
}

export const HoverEffectOverlay = ({ hovered }: HoverEffectOverlayProps) => {
  const leftRects = [
    { id: "left-1", finalX: -370, color: "bg-blue-300", delay: 0 },
    { id: "left-2", finalX: -350, color: "bg-blue-400", delay: 0.05 },
    { id: "left-3", finalX: -330, color: "bg-blue-500", delay: 0.1 },
  ]
  const rightRects = [
    { id: "right-1", finalX: -370, color: "bg-blue-300", delay: 0 },
    { id: "right-2", finalX: -350, color: "bg-blue-400", delay: 0.05 },
    { id: "right-3", finalX: -330, color: "bg-blue-500", delay: 0.1 },
  ]

  return (
    <>
      {/* Left side rectangles */}
      {leftRects.map(({ id, finalX, color, delay }) => (
        <motion.div
          key={id}
          initial={false} // prevent animation on mount
          animate={{ x: hovered ? finalX : "-100%" }}
          transition={{
            duration: 0.3,
            delay,
            ease: "easeOut",
          }}
          className={`fixed top-0 h-screen w-96 ${color} opacity-20 pointer-events-none`}
          style={{ left: 0 }}
        />
      ))}

      {/* Right side rectangles */}
      {rightRects.map(({ id, finalX, color, delay }) => (
        <motion.div
          key={id}
          initial={false}
          animate={{ x: hovered ? -finalX : "100%" }}
          transition={{
            duration: 0.3,
            delay,
            ease: "easeOut",
          }}
          className={`fixed top-0 h-screen w-96 ${color} opacity-20 pointer-events-none`}
          style={{ right: 0 }}
        />
      ))}
    </>
  )
}
