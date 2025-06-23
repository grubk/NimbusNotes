import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface FullscreenLoaderProps {
    label?: string
}

export const FullscreenLoader = ({ label}: FullscreenLoaderProps) => {
    return (
        <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                {label && <p className="text-blue-600 font-medium">{label}</p>}
              </div>
            </motion.div>
    )
}