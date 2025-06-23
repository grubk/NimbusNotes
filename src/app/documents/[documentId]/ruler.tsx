import { FaCaretDown } from "react-icons/fa"
import { useRef, useState, useEffect } from "react"
import { useStorage } from "@liveblocks/react"
import { useMutation } from "@liveblocks/react"

const markers = Array.from({ length: 83 }, (_, i) => i)

export const Ruler = () => {
  const leftMargin = useStorage((root) => root.leftMargin) ?? 56
  const setLeftMargin = useMutation(({ storage }, position: number) => {
    storage.set("leftMargin", position)
  }, [])

  const rightMargin = useStorage((root) => root.rightMargin) ?? 56
  const setRightMargin = useMutation(({ storage }, position: number) => {
    storage.set("rightMargin", position)
  }, [])


  const [dragging, setDragging] = useState<"left" | "right" | null>(null)
  const [guideLineX, setGuideLineX] = useState<number | null>(null)
  const [rulerLeftOffset, setRulerLeftOffset] = useState(0)

  const rulerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !rulerRef.current) return

      const container = rulerRef.current.getBoundingClientRect()
      const relativeX = e.clientX - container.left
      const clampedX = Math.max(0, Math.min(816, relativeX))
      setRulerLeftOffset(container.left)

      if (dragging === "left") {
        const maxLeft = 816 - rightMargin - 100
        const clampedLeft = Math.min(clampedX, maxLeft)
        setLeftMargin(clampedLeft)
        setGuideLineX(clampedLeft)
      } else if (dragging === "right") {
        const minRight = leftMargin + 100
        const clampedRight = Math.max(clampedX, minRight)
        const rightVal = 816 - clampedRight
        const maxRight = 816 - leftMargin - 100
        setRightMargin(Math.min(rightVal, maxRight))
        setGuideLineX(clampedRight)
      }
    }

    const handleMouseUp = () => {
      setDragging(null)
      setGuideLineX(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging, leftMargin, rightMargin])

  const handleLeftDoubleClick = () => setLeftMargin(56)
  const handleRightDoubleClick = () => setRightMargin(56)

  return (
    <>
    {/* Background block with customizable z-index */}
<div
      className="fixed left-0 right-0 bg-[#FAFBFD]"
      style={{
        top: 0,
        height: '126px',     // Height from top to ruler top
        zIndex: 5        // Customize z-index here (below ruler's z-40)
      }}
    />
      {/* 🟦 Global guideline (fixed height) */}
      {guideLineX !== null && (
        <div
          className="fixed top-36 bottom-0 w-[1px] bg-blue-500 opacity-60 pointer-events-none z-50"
          style={{ left: `${guideLineX + rulerLeftOffset}px` }}
        />
      )}

      <div className="fixed top-[126px] left-0 right-0 h-6 border-b border-t border-gray-300 bg-[#FAFBFD] flex items-end select-none z-40 print:hidden">
        <div
          ref={rulerRef}
          id="ruler-container"
          className="max-w-[816px] mx-auto w-full h-full relative"
        >
          {/* Marker handles */}
          <Marker
            position={leftMargin}
            onMouseDown={() => setDragging("left")}
            onDoubleClick={handleLeftDoubleClick}
          />
          <Marker
            position={816 - rightMargin}
            onMouseDown={() => setDragging("right")}
            onDoubleClick={handleRightDoubleClick}
          />

          {/* Tick marks */}
          <div className="absolute inset-x-0 bottom-0 h-full">
            <div className="relative h-full w-[816px]">
              {markers.map((marker) => {
                const position = (marker * 816) / 82

                return (
                  <div
                    key={marker}
                    className="absolute bottom-0"
                    style={{ left: `${position}px` }}
                  >
                    {marker % 10 === 0 && (
                      <>
                        <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                        <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                          {marker / 10 + 1}
                        </span>
                      </>
                    )}
                    {marker % 5 === 0 && marker % 10 !== 0 && (
                      <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                    )}
                    {marker % 5 !== 0 && (
                      <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface MarkerProps {
  position: number
  onMouseDown: () => void
  onDoubleClick: () => void
}

const Marker = ({
  position,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ left: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
    </div>
  )
}
