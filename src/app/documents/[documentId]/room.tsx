"use client"

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers } from "./actions";
import { toast } from "sonner";

type User = { id: string; name: string; avatar: string; color: string; }

export function Room({ children }: { children: ReactNode }) {
    const params = useParams()
    const [users, setusers] = useState<User[]>([])

    const fetchUsers = useMemo(
      () => async () => {
        try {
          const list = await getUsers()
          setusers(list)
        } catch {
          toast.error("Failed to fetch users")
        }
      },
      []
    )

    useEffect(() => {
      fetchUsers()
    }, [fetchUsers] )

  return (
    <LiveblocksProvider
        throttle={16}
        authEndpoint="/api/liveblocks-auth"
        resolveUsers={({ userIds }) => {
          return userIds.map(
            (userId) => users.find((user) => user.id === userId) ?? undefined
          )
        }}
        resolveMentionSuggestions={({ text }) => {
          let filteredUsers = users
          if (text) {
            filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase()))
          }

          return filteredUsers.map((user) => user.id)
        }}
        resolveRoomsInfo={() => []}
    >
      <RoomProvider id={params.documentId as string} initialStorage={{ leftMargin: 56, rightMargin: 56 }}>
        <ClientSideSuspense fallback={<FullscreenLoader label="Document Loading..."/>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}