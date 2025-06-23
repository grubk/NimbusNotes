"use client"

import { useState } from "react"
import { HoverEffectOverlay } from "./hover-effect-overlay"
import { SnakeButton } from "./snake-button"
import { CloudAnimation } from "./cloud-animation"



const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageUrl: "/assets/blank-document.svg",
  },
]

const motto = "Change the world,\none cloud at a time."

export const TemplateGallery = () => {


  // Track if ANY button is hovered
  const [isHoveringButton, setIsHoveringButton] = useState(false)

  return (
    <div className="relative top-44 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F1F3F4]/50 my-3 max-h-[375px] z-20">
        <CloudAnimation top="0px" height="375px" />
      {/* Always render HoverEffectOverlay but control animation by hovered prop */}
      <HoverEffectOverlay hovered={isHoveringButton} />

      <div className="max-w-screen-xl mx-auto px-16 py-4 flex flex-col gap-y-4 relative z-10">
        <h2 className="font-medium text-center text-[#4285F4]">Create A New Document</h2>
        <div className="flex justify-center gap-x-8">
          {templates.map((template) => (
            <SnakeButton
              key={template.id}
              backgroundImage={template.imageUrl}
              label={motto}
              isHovered={isHoveringButton}
              //onClick={() => onTemplateClick(template.label)}
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
