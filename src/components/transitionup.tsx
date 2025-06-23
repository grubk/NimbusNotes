"use client"

import React, { useState, useEffect, ReactNode } from "react"
import { motion } from "framer-motion"

interface TransitionProps {
  children?: ReactNode
  duration?: number
}

export const Transition = ({ children, duration = 1000 }: TransitionProps) => {
  const [direction, setDirection] = useState<"in" | "out">("in")

  useEffect(() => {
    // Start with bars covering the screen (y=0)
    setDirection("in")

    // After duration, slide bars up (y: -100%)
    const timeout = setTimeout(() => {
      setDirection("out")
    }, duration)

    return () => clearTimeout(timeout)
  }, [duration])

  // Three vertical bars, side by side, full height screen, each 1/3 width
  const bars = [
    { id: "bar1", color: "bg-blue-100", delay: 0 },
    { id: "bar2", color: "bg-blue-200", delay: 0.05 },
    { id: "bar3", color: "bg-blue-300", delay: 0.1 },
  ]

  return (
    <>
      {/* Bars stacked horizontally, covering the entire screen */}
      {bars.map(({ id, color, delay }, i) => (
        <motion.div
          key={id}
          initial={false}
          animate={{
            y: direction === "in" ? 0 : "-100%", // slide up off screen
          }}
          transition={{
            duration: 0.6,
            delay,
            ease: "easeInOut",
          }}
          className={`${color} fixed top-0 left-[${i * 33.3333}%] h-screen w-[33.3333%] opacity-100 pointer-events-none z-[1000]`}
          style={{ left: `${i * 33.3333}%` }}
        />
      ))}

      {/* Wrapped page content */}
      <div>{children}</div>
    </>
  )
}
