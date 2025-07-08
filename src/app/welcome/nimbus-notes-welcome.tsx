"use client"

import { Button } from "@/components/ui/button"
import { Home, User, Mail, Github, Loader2, Zap, Users, Globe, Palette, CloudSun, CloudSunRain, CloudRain } from "lucide-react"
import Image from 'next/image'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import Waves from './waves'

type Layout = "home" | "about" | "contact"

export default function NimbusNotesWelcome() {

  const router = useRouter()

  const [currentLayout, setCurrentLayout] = useState<Layout>("home")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)



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
    window.open("https://github.com/grubk/NimbusNotes", "_blank")
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
      
      <Waves
        lineColor="#0080FF1a"
        backgroundColor="rgba(255, 255, 255, 0)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={50}
        waveAmpY={20}
        friction={0.5}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="relative w-full h-0">
        <div className="absolute top-6 left-4 flex items-center gap-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-500/60 via-blue-500/60 to-blue-500/60 bg-clip-text text-transparent" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Nimbus Notes
          </h1>
          <Image src="/assets/nimbuscloudfilled.png" alt="Nimbus Cloud" width={65} height={65} className="opacity-60" />
        </div>
      </div>


      <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {renderCurrentLayout()}
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-4 flex-wrap justify-center">
          <LayoutButton icon={<Home className="w-4 h-4" />} text="Home" layout="home" />
          <LayoutButton icon={<Mail className="w-4 h-4" />} text="Contact" layout="contact" />
          <LayoutButton icon={<User className="w-4 h-4" />} text="About" layout="about" />
        </div>
      </div>
    </div>
  )

  function LayoutButton({ icon, text, layout }: { icon: React.ReactNode; text: string; layout: Layout }) {
    const isActive = currentLayout === layout
    const baseStyles =
      "px-8 py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"

    const activeStyles = "bg-blue-400 text-blue-900 border-transparent cursor-not-allowed opacity-90"
    const inactiveStyles = "bg-blue-200 hover:bg-blue-400 border-transparent text-blue-900 hover:border-blue-300"


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
          className="bg-blue-300 hover:bg-blue-400 text-blue-900 font-medium px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 mt-20"
        >
          {"Let's Begin"}
        </Button>
      </main>
    )
  }

  function renderAboutLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-sky-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-indigo-200/25 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-40 relative z-10 max-w-7xl mx-auto scale-110 overflow-hidden">
        {/* Main Content Layout */}
        <div className="grid md:grid-cols-2 gap-8 w-full overflow-hidden">
          {/* Left Section */}
          <div className="bg-transparent backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200/50 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-300 to-blue-400 p-6 text-sky-100 relative">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-center">About Nimbus</h2>
                </div>
                <div className="flex justify-center gap-2 overflow-hidden">
                  <CloudRain className="w-5 h-5 text-sky-200 animate-pulse" />
                  <CloudSunRain className="w-4 h-4 text-blue-200 animate-pulse delay-500" />
                  <CloudSun className="w-4 h-4 text-indigo-200 animate-pulse delay-1000" />
                </div>
              </div>
            </div>

            {/* Description and Feature Icons */}
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700">
                  Nimbus Notes aims to bring a new digital note-taking experience to STEM students, offering an
                  efficient and clean note-taking interface. Our platform empowers users to capture, organize, and
                  access their thoughts from anywhere in the world.
                </p>
                <p className="text-base leading-relaxed text-gray-700">
                  Built with modern web technologies and a focus on user experience, Nimbus Notes offers real-time
                  synchronization across all your devices. Whether you&apos;re brainstorming ideas, taking notes in class,
                  or collaborating with others, our intuitive interface adapts to your workflow.
                </p>

                {/* Feature Icons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-200/50 text-center group hover:shadow-lg transition-all duration-300">
                    <Zap className="w-6 h-6 text-sky-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Lightning Fast</h4>
                    <p className="text-xs text-gray-600">Instant sync across devices</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50 text-center group hover:shadow-lg transition-all duration-300">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Collaborative</h4>
                    <p className="text-xs text-gray-600">Share and work together</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200/50 text-center group hover:shadow-lg transition-all duration-300">
                    <Globe className="w-6 h-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Global Access</h4>
                    <p className="text-xs text-gray-600">Available anywhere</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50 text-center group hover:shadow-lg transition-all duration-300">
                    <Palette className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Rich Content</h4>
                    <p className="text-xs text-gray-600">Tables, code blocks, and more</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6 overflow-hidden">
            {/* Key Features Section */}
            <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-sky-200/50 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Key Features</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Rich Text Editing</h4>
                    <p className="text-gray-600 text-sm">Advanced formatting options for all your notes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 overflow-hidden">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Surreal User Experience</h4>
                    <p className="text-gray-600 text-sm">Modern UI/UX elements and fluid animations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Auto-saving</h4>
                    <p className="text-gray-600 text-sm">Never lose any of your work, ever again</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Collaborative Sharing</h4>
                    <p className="text-gray-600 text-sm">Work together in real-time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500/60 to-blue-600/60 text-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">Transform your productivity with Nimbus Notes today.</p>
                <p className="text-sky-100">
                  Experience the future of note-taking – where you can take your creativity to the skies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
  }

  function renderContactLayout() {
    return (
      <main className="flex flex-col items-center justify-center px-8 py-16 relative z-10 max-w-2xl mt-20 mx-auto">
        <div className="bg-transparent backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-none w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-8 text-center">Get in Touch</h2>
          <div className="space-y-8">
            <p className="text-lg text-gray-600 text-center mb-8">
              We&apos;d love to hear from you! Reach out through any of the channels below.
            </p>
            <div className="space-y-6">
              <Button
                onClick={handleEmailClick}
                className="w-full bg-blue-300 hover:bg-blue-400 text-blue-900 font-medium px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5" />
                Send an Email
              </Button>
              <Button
                onClick={handleGithubClick}
                variant="outline"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-6 text-lg rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Button>
            </div>
            <div className="text-center pt-6 border-t border-blue-100">
              <p className="text-gray-500 mb-2">Email me directly at:</p>
              <p className="text-blue-500 font-medium">kgrubert@student.ubc.ca</p>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
