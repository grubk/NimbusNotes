"use client";

import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { FullscreenLoader } from "./fullscreen-loader";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  //Exclude auth on welcome page
  const isPublicPage = pathname === "/welcome" || pathname === "/";

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {isPublicPage ? (
          children
        ) : (
          <>
            <Authenticated>{children}</Authenticated>
            <Unauthenticated>
              <div className="flex flex-col items-center justify-center min-h-screen">
                <SignIn
                  routing="hash"
                  forceRedirectUrl="/home" 
                  fallbackRedirectUrl="/home"
                  />
              </div>
            </Unauthenticated>
            <AuthLoading>
              <FullscreenLoader label="Loading Authentication..."/>
            </AuthLoading>
          </>
        )}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
