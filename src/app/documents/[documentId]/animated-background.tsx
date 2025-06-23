"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [isHoveredTop, setIsHoveredTop] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsHoveredTop(e.clientY <= 200)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const diamonds = [
    { size: 300, color: "bg-blue-500", delay: "100ms" },
    { size: 700, color: "bg-blue-400", delay: "200ms" },
    { size: 900, color: "bg-blue-300", delay: "300ms" },
    { size: 1100, color: "bg-blue-200", delay: "400ms" },
  ]

  return (
    <div className="fixed -top-10 left-0 right-0 h-[190px] overflow-hidden z-10 pointer-events-none">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        {diamonds.map((diamond, index) => (
          <div
            key={index}
            className={`absolute ${diamond.color} rotate-45 transition-all duration-700 ease-out`}
            style={{
              width: `${diamond.size}px`,
              height: `${diamond.size}px`,
              top: `${index * -40}px`,
              left: `${-diamond.size / 2}px`,
              transform: `${isHoveredTop
                ? `scale(${1 + index * 0.1}) rotate(45deg)`
                : "scale(1) rotate(45deg)"}`,
              transitionDelay: isHoveredTop ? diamond.delay : `${400 - index * 100}ms`,
              opacity: 0.75 - index * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
