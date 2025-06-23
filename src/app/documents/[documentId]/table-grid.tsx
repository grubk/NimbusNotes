"use client"

import { useState } from "react"

export const TableGrid = ({ onSelect }: { onSelect: (rows: number, cols: number) => void }) => {
  const maxRows = 8
  const maxCols = 8
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 })

  return (
    <div className="grid gap-0.5 p-2 bg-white border rounded-md shadow select-none">
      {Array.from({ length: maxRows }).map((_, row) => (
        <div key={row} className="flex">
          {Array.from({ length: maxCols }).map((_, col) => {
            const isSelected = row <= hovered.rows && col <= hovered.cols

            // For selected squares, interpolate lightness from blue-200 (light) to blue-500 (dark) based on row
            // For non-selected squares, background is white
            const startHue = 210; // blue hue
            const startLightness = 80; // blue-200 approx
            const endLightness = 55; // blue-500 approx

            // Fraction relative to max selected row
            // Use hovered.rows to scale gradient only on selected rows
            // If no rows selected (hovered.rows = -1), avoid division by zero and no gradient
            const fraction = hovered.rows > 0 ? row / hovered.rows : 0

            const bgColor = isSelected
              ? `hsl(${startHue}, 100%, ${
                  startLightness - fraction * (startLightness - endLightness)
                }%)`
              : "white"

            return (
              <div
                key={col}
                onMouseEnter={() => setHovered({ rows: row, cols: col })}
                onClick={() => onSelect(row + 1, col + 1)}
                style={{ backgroundColor: bgColor }}
                className="w-6 h-6 border rounded-md cursor-pointer hover:brightness-90 transition"
              />
            )
          })}
        </div>
      ))}
      <div className="text-xs text-center pt-2 text-gray-500">
        {hovered.rows + 1} x {hovered.cols + 1}
      </div>
    </div>
  )


}
