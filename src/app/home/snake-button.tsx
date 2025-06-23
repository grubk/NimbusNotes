"use client"

import React, { useState } from "react"
import ReactDOM from "react-dom"
import styles from "./snake-button.module.css"
import { cn } from "@/lib/utils"
import { TransitionDown } from "@/components/transitiondown"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"

interface SnakeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundImage: string
  label: string
  hoverOverlay?: React.ReactNode
  isHovered?: boolean
}

export const SnakeButton: React.FC<SnakeButtonProps> = ({
  backgroundImage,
  label,
  isHovered,
  hoverOverlay,
  disabled,
  ...props
}) => {
    const [hovered, setHovered] = useState(false)
    const [showTransition, setShowTransition] = useState(false)
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)
    const create = useMutation(api.documents.create)

  const onTemplateClick = (title: string = "Untitled Document") => {
    if (isCreating) return
    setIsCreating(true)
    setShowTransition(true); // start the transition
    create({ title })
      .then((documentId) => {
        setTimeout(() => {
          router.push(`/documents/${documentId}`)
        }, 500)
      })
      .finally(() => {
        setIsCreating(false)
      })
  }

  return (
    <>
      {/* Portal the transition overlay to document.body */}
      {showTransition &&
        ReactDOM.createPortal(
          <TransitionDown
            duration={0}
            className="fixed top-0 left-0 w-screen h-screen z-[9999]"
          />,
          document.body
        )}

      <a
        href="#"
        className={styles.wrapper}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={styles.inside}>
          <button
            {...props}
            disabled={disabled}
            className={styles.button}
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
            onClick={() => onTemplateClick()} // override onClick to trigger transition
          />
          <span className={styles.shiny} />
          {hovered && hoverOverlay}
        </div>
        <p
          className={cn(
            "text-sm font-extralight text-center whitespace-pre-line mt-2 transition-all",
            isHovered ? "font-semibold text-blue-500" : "font-extralight"
          )}
        >
          {label}
        </p>
      </a>
    </>
  )
}
