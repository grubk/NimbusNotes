"use client"

import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";
import { AnimatedBackground } from "./animated-background"
import { Transition } from "@/components/transitionup"
import { Room } from "./room";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface DocumentProps {
    preloadedDocument: Preloaded<typeof api.documents.getById>
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Document = ({ preloadedDocument }: DocumentProps) => {
    const document = usePreloadedQuery(preloadedDocument)

    return ( 
        <Transition>
        <Room>
        <div className="min-h-screen bg-[#FAFBFD] relative z-20">
            {/* Animated background positioned behind everything */}
            <AnimatedBackground />
            {/* Foreground: Navbar and Toolbar */}
            <div className="flex flex-col px-4 pt-2 gap-y-0.5 fixed top-0 left-0 right-0 z-30 bg-transparent print:hidden">
                <Navbar data={document}/>
                <Toolbar/>
            </div>
            {/* Editor content area */}
            <div className="pt-[140px] print:pt-0 z-0">
                <Editor />
            </div>
        </div>
        </Room>
        </Transition>
     );
}
