"use client"

import React, { useState, useEffect, ReactNode } from "react"
import { motion } from "framer-motion"

interface TransitionDownProps {
  children?: ReactNode
  duration?: number
  className?: string
}

export const TransitionDown = ({ children, duration = 0 }: TransitionDownProps) => {
  const [direction, setDirection] = useState<"in" | "out">("in")

  useEffect(() => {
    setDirection("in")

    const timeout = setTimeout(() => {
      setDirection("out")
    }, duration)

    return () => clearTimeout(timeout)
  }, [duration])

  const bars = [
    { id: "bar1", color: "bg-blue-100", delay: 0 },
    { id: "bar2", color: "bg-blue-200", delay: 0.05 },
    { id: "bar3", color: "bg-blue-300", delay: 0.1 },
  ]

  return (
    <>
      {/* Fullscreen fixed wrapper to guarantee top layer */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {bars.map(({ id, color, delay }, i) => (
          <motion.div
            key={id}
            initial={false}
            animate={{
              y: direction === "in" ? "-100%" : 0,
            }}
            transition={{
              duration: 0.6,
              delay,
              ease: "easeInOut",
            }}
            className={`${color} fixed top-0 h-screen w-[33.3333%] opacity-100`}
            style={{ left: `${i * 33.3333}%` }}
          />
        ))}
      </div>

      <div>{children}</div>
    </>
  )
}

