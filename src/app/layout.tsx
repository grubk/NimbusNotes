import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "@/components/ui/sonner";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";


import { ConvexClientProvider } from "@/components/convex-client-provider";



export const metadata: Metadata = {
  title: "Nimbus Notes",
  description: "A collaborative note-taking application",
  icons: {
    icon: [
      { url: "/assets/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
    other: [
      {
        rel: "icon",
        url: "/assets/favicon.png",
      },
    ],
  },
};

const inter = Inter({
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <NuqsAdapter>
          <ConvexClientProvider>
            <Toaster />
          {children}
          </ConvexClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
