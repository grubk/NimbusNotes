"use client"

import { Button } from "@/components/ui/button"
import { Home, User, Mail, Github, CloudLightning, Loader2 } from "lucide-react"
import Image from 'next/image'
import { useState, useEffect, useRef } from "react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"

type Layout = "home" | "about" | "contact"

export default function NimbusNotesWelcome() {

  const router = useRouter()

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentLayout, setCurrentLayout] = useState<Layout>("home")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const leftCloudRef = useRef<HTMLDivElement>(null)
  const rightCloudRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      const screenWidth = window.innerWidth
      const percentX = (e.clientX / screenWidth - 0.5) * 2
      const offset = percentX * 40

      if (leftCloudRef.current) {
        leftCloudRef.current.style.transform = `translateX(${offset}px) rotate(45deg)`
      }

      if (rightCloudRef.current) {
        rightCloudRef.current.style.transform = `translateX(${offset}px) rotate(-45deg)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (leftCloudRef.current) {
      leftCloudRef.current.style.transform = `rotate(45deg)`
    }
    if (rightCloudRef.current) {
      rightCloudRef.current.style.transform = `rotate(-45deg)`
    }
  }, [])

  const handleLayoutChange = (newLayout: Layout) => {
    if (newLayout === currentLayout || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentLayout(newLayout)
      setIsTransitioning(false)
    }, 300)
  }

  const handleLetsBegin = () => {
    console.log("Let's Begin clicked!")

    // Prevent multiple clicks during navigation
    if (isNavigating) return

    setIsNavigating(true)

    //Navigate after animation
    setTimeout(() => {
      router.push("/home")
    }, 2500) // 2.5 seconds total animation time
  }


  const handleEmailClick = () => {
    window.location.href = "mailto:kgrubert@student.ubc.ca"
  }

  const handleGithubClick = () => {
    window.open("https://github.com/grubk/", "_blank")
  }

  const dots = [
    { x: 8, y: 12, size: 16, color: "bg-blue-300", intensity: 0.45 },
    { x: 15, y: 8, size: 12, color: "bg-blue-200", intensity: 0.42 },
    { x: 25, y: 25, size: 8, color: "bg-blue-300", intensity: 0.4 },
    { x: 35, y: 15, size: 12, color: "bg-blue-200", intensity: 0.43 },
    { x: 45, y: 35, size: 10, color: "bg-blue-300", intensity: 0.41 },
    { x: 55, y: 20, size: 14, color: "bg-blue-200", intensity: 0.44 },
    { x: 65, y: 40, size: 8, color: "bg-blue-300", intensity: 0.39 },
    { x: 75, y: 10, size: 12, color: "bg-blue-200", intensity: 0.42 },
    { x: 85, y: 30, size: 16, color: "bg-blue-300", intensity: 0.46 },
    { x: 95, y: 18, size: 10, color: "bg-blue-200", intensity: 0.4 },
    { x: 12, y: 55, size: 14, color: "bg-blue-300", intensity: 0.43 },
    { x: 22, y: 65, size: 8, color: "bg-blue-200", intensity: 0.48 },
    { x: 32, y: 75, size: 12, color: "bg-blue-300", intensity: 0.41 },
    { x: 42, y: 85, size: 10, color: "bg-blue-200", intensity: 0.4 },
    { x: 52, y: 95, size: 16, color: "bg-blue-300", intensity: 0.45 },
    { x: 62, y: 65, size: 8, color: "bg-blue-200", intensity: 0.39 },
    { x: 72, y: 75, size: 14, color: "bg-blue-300", intensity: 0.44 },
    { x: 82, y: 85, size: 12, color: "bg-blue-200", intensity: 0.42 },
    { x: 92, y: 95, size: 10, color: "bg-blue-300", intensity: 0.4 },
    { x: 18, y: 45, size: 8, color: "bg-blue-200", intensity: 0.18 },
    { x: 28, y: 55, size: 12, color: "bg-blue-300", intensity: 0.32 },
    { x: 38, y: 65, size: 10, color: "bg-blue-200", intensity: 0.4 },
    { x: 48, y: 75, size: 14, color: "bg-blue-300", intensity: 0.43 },
    { x: 58, y: 85, size: 8, color: "bg-blue-200", intensity: 0.39 },
    { x: 68, y: 95, size: 16, color: "bg-blue-300", intensity: 0.46 },
    { x: 78, y: 45, size: 12, color: "bg-blue-200", intensity: 0.41 },
    { x: 88, y: 55, size: 10, color: "bg-blue-300", intensity: 0.4 },
    { x: 5, y: 35, size: 14, color: "bg-blue-200", intensity: 0.43 },
    { x: 95, y: 65, size: 8, color: "bg-blue-300", intensity: 0.48 },
    { x: 50, y: 5, size: 12, color: "bg-blue-200", intensity: 0.42 },
  ]

  const calculateDotTransform = (dot: (typeof dots)[0]) => {
    if (!hasMounted) return "none"

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (mousePosition.x - centerX) * dot.intensity
    const deltaY = (mousePosition.y - centerY) * dot.intensity
    return `translate(${deltaX}px, ${deltaY}px)`
  }

  const renderCurrentLayout = () => {
    switch (currentLayout) {
      case "home":
        return renderHomeLayout()
      case "about":
        return renderAboutLayout()
      case "contact":
        return renderContactLayout()
      default:
        return renderHomeLayout()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">

{/* Navigation Transition Overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* White fade overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0 }}
              className="absolute inset-0 bg-white"
            />

            {/* Loading spinner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-blue-600 font-medium">Loading your workspace...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 opacity-20">
        {hasMounted && dots.map((dot, index) => (
          <div
            key={index}
            className={`absolute ${dot.color} rounded-full transition-transform duration-100 ease-out`}
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              transform: calculateDotTransform(dot),
            }}
          />
        ))}
      </div>

      <div className="relative w-full h-0">
        <div className="absolute top-6 left-4">
          <Image src="/assets/nimbuslogo.png" alt="Decorative Top Right" width={500} height={65} />
        </div>
      </div>

      <div className="relative w-full h-0">
        <div ref={leftCloudRef} className="fixed -bottom-80 -left-96 transition-transform duration-100 ease-out">
          <Image src="/assets/clouds.png" alt="Decorative Cloud Left" width={1200} height={500} />
        </div>
      </div>

      <div className="relative w-full h-0">
        <div ref={rightCloudRef} className="fixed -bottom-80 -right-96 transition-transform duration-100 ease-out">
          <Image src="/assets/clouds.png" alt="Decorative Cloud Right" width={1200} height={500} />
        </div>
      </div>

      <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {renderCurrentLayout()}
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-4 flex-wrap justify-center">
          <LayoutButton icon={<Home className="w-4 h-4" />} text="Home" layout="home" />
          <LayoutButton icon={<User className="w-4 h-4" />} text="About" layout="about" />
          <LayoutButton icon={<Mail className="w-4 h-4" />} text="Contact" layout="contact" />
        </div>
      </div>
    </div>
  )

  function LayoutButton({ icon, text, layout }: { icon: React.ReactNode; text: string; layout: Layout }) {
    const isActive = currentLayout === layout
    const baseStyles =
      "px-8 py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"

    const activeStyles = "bg-blue-200 text-blue-900 border-transparent cursor-not-allowed opacity-90"
    const inactiveStyles = "bg-blue-100 hover:bg-blue-200 border-transparent text-blue-900 hover:border-blue-300"


    return (
      <Button
        onClick={() => handleLayoutChange(layout)}
        disabled={isActive}
        variant="outline"
        className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
      >
        {icon}
        {text}
      </Button>
    )
  }

  function renderHomeLayout() {
    return (
      <main className="flex flex-col items-center justify-center px-20 py-40 mt-60 relative z-20"
        style={{ transform: "scale(1.5)"}}
        >
        <div className="flex flex-col md:flex-row md:space-x-10 max-w-4xl w-full">
          <div className="flex-1 text-right md:text-right mb-9 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-700 mb-4">Welcome</h2>
          </div>
          <div className="flex-1 text-left mt-2">
            <p className="text-lg text-gray-500">
              to an <span className="font-semibold">all new</span>
              <br />
              note-taking experience.
            </p>
          </div>
        </div>
        <Button
          onClick={handleLetsBegin}
          disabled={isNavigating}
          className="bg-sky-200 hover:bg-sky-300 text-blue-900 font-medium px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 mt-20"
        >
          {"Let's Begin"}
        </Button>
      </main>
    )
  }

  function renderAboutLayout() {
    return (
      <main className="flex flex-col items-center justify-center px-8 py-16 relative z-10 max-w-4xl mt-20 mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-8 text-center flex items-center justify-center gap-6">
            About Nimbus Notes
            <CloudLightning className="w-16 h-16 text-gray-700" />
            </h2>
          <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
            <p>
              Nimbus Notes aims to bring a new digital note-taking experience to STEM students,
              offering an efficient and clean note-taking interface. Our platform empowers users to capture,
              organize, and access their thoughts from anywhere in the world. 🌥️
            </p>
            <p>
              Built with modern web technologies and a focus on user experience, Nimbus Notes offers real-time
              synchronization across all your devices. Whether you&apos;re brainstorming ideas, taking notes in class, or
              collaborating with others, our intuitive interface adapts to your workflow. ⛅
            </p>
            <p>
              Key features include rich text editing, easy-to-create flowcharts and diagrams, collaborative sharing,
              and seamless AI integration to significantly speed up your workflow. Experience the future of note-taking
              with Nimbus Notes –
              where you can take your creativity to the skies. 🌤️
            </p>
            <p className="text-sky-500 font-medium">
              Transform your productivity with Nimbus Notes today.
            </p>
          </div>
        </div>
      </main>
    )
  }

  function renderContactLayout() {
    return (
      <main className="flex flex-col items-center justify-center px-8 py-16 relative z-10 max-w-2xl mt-20 mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100 w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-8 text-center">Get in Touch</h2>
          <div className="space-y-8">
            <p className="text-lg text-gray-600 text-center mb-8">
              We&apos;d love to hear from you! Reach out through any of the channels below.
            </p>
            <div className="space-y-6">
              <Button
                onClick={handleEmailClick}
                className="w-full bg-sky-200 hover:bg-sky-300 text-blue-900 font-medium px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5" />
                Send an Email
              </Button>
              <Button
                onClick={handleGithubClick}
                variant="outline"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-400 px-8 py-6 text-lg rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Button>
            </div>
            <div className="text-center pt-6 border-t border-blue-100">
              <p className="text-gray-500 mb-2">Email me directly at:</p>
              <p className="text-sky-500 font-medium">kgrubert@student.ubc.ca</p>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
