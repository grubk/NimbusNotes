"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import {
  Cloud,
  CloudRain,
  CloudSun,
  CloudMoon,
} from "lucide-react"

const cloudIcons = [Cloud, CloudRain, CloudSun, CloudMoon]

type CloudConfig = {
  id: number
  Icon: React.ElementType
  size: number
  speed: number // seconds to cross screen
  top: number // percent vertical position
  initialX: number // starting X in vw (can be < 0 or > 100 for offscreen)
}

// Generate clouds with an optional horizontal offset (offsetX in vw)
const generateClouds = (
  count: number,
  maxSpeed: number,
  offsetX = 0
): CloudConfig[] => {
  const spacing = 100 / count
  return Array.from({ length: count }, (_, i) => {
    const Icon = cloudIcons[i % cloudIcons.length]
    const size = Math.random() * 40 + 20
    const rawSpeed = 60 - size
    const speed = Math.max(rawSpeed, maxSpeed)
    const top = Math.random() * 100
    // Distribute clouds evenly across 0-100vw horizontally on first render (ignore offsetX here)
    // We'll add offsetX only to second set
    const initialX = spacing * i + (Math.random() * spacing * 0.5) // spread clouds with some randomness
    return {
      id: i,
      Icon,
      size,
      speed,
      top,
      initialX: initialX + offsetX,
    }
  })
}

export const CloudAnimation = ({
  top = "100px",
  height = "300px",
  cloudCount = 15,
  maxSpeed = 30,
}: {
  top?: string
  height?: string
  cloudCount?: number
  maxSpeed?: number
}) => {
  const [clouds, setClouds] = useState<CloudConfig[]>([])

  useEffect(() => {
    // Generate two sets:
    // - First set: offsetX = 0, spread clouds fully covering screen (0-100vw)
    // - Second set: offsetX = -100vw, spread clouds fully covering offscreen area left of viewport
    const firstSet = generateClouds(cloudCount, maxSpeed, 0)
    const secondSet = generateClouds(cloudCount, maxSpeed, -90)
    // Adjust ids to be unique
    const secondSetWithIds = secondSet.map((c) => ({ ...c, id: c.id + cloudCount }))
    setClouds([...firstSet, ...secondSetWithIds])
  }, [cloudCount, maxSpeed])

  return (
    <div
      className="pointer-events-none overflow-hidden absolute w-full"
      style={{ top, height }}
    >
      {clouds.map(({ Icon, size, speed, top, id, initialX }) => (
        <MovingCloud
          key={id}
          Icon={Icon}
          size={size}
          speed={speed}
          top={top}
          initialX={initialX}
          cloudCount={cloudCount * 2}
        />
      ))}
    </div>
  )
}

const MovingCloud = ({
  Icon,
  size,
  speed,
  top,
  initialX,
  cloudCount,
}: {
  Icon: React.ElementType
  size: number
  speed: number
  top: number
  initialX: number
  cloudCount: number
}) => {
  const controls = useAnimation()
  const [opacity, setOpacity] = useState(0)
  const xRef = useRef(initialX) // horizontal position in vw
  const requestRef = useRef<number>()

  // Movement loop: start immediately
  useEffect(() => {
  const speedPerFrame = 100 / (speed * 60)
  let animationFrameId: number
  let mounted = true

  const move = () => {
    xRef.current += speedPerFrame
    if (xRef.current > 100) {
      const spacing = 100 / cloudCount
      xRef.current = -spacing * cloudCount + Math.random() * spacing
    }

    if (mounted) {
      try {
        controls.set({ x: `${xRef.current}vw` }) // ✅ protect this
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // This can throw if the motion component unmounted
        // Optionally log or ignore
      }

      animationFrameId = requestAnimationFrame(move)
    }
  }

  animationFrameId = requestAnimationFrame(move)

  return () => {
    mounted = false
    cancelAnimationFrame(animationFrameId)
  }
}, [speed, cloudCount, controls])


  // Fade-in opacity independently
  useEffect(() => {
    const fadeDuration = 1000 // ms
    let startTime: number | null = null

    const fadeStep = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / fadeDuration, 1)
      setOpacity(progress * 0.5) // max opacity 0.5
      if (progress < 1) {
        requestRef.current = requestAnimationFrame(fadeStep)
      }
    }

    requestRef.current = requestAnimationFrame(fadeStep)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <motion.div
      className="absolute text-blue-500"
      style={{
        top: `${top}%`,
        fontSize: `${size}px`,
        opacity,
        position: "absolute",
      }}
      animate={controls}
      initial={false}
      transition={{ ease: "linear" }}
    >
      <Icon size={size} />
    </motion.div>
  )
}
