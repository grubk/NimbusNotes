"use client"

import { Separator } from "@/components/ui/separator"
import { ClientSideSuspense } from "@liveblocks/react/suspense"
import { useOthers, useSelf } from "@liveblocks/react/suspense"

const AVATAR_SIZE = 36

export const Avatars = () => {
    return (
        <ClientSideSuspense fallback={null}>
            <AvatarStack/>
        </ClientSideSuspense>
    )
}

const AvatarStack = () => {
    const users = useOthers()
    const currentUser = useSelf()

    if (users.length === 0) return null

    return (
        <>
            <div className="flex items-center">
                {currentUser && (
                    <div className="relative ml-2">
                        <Avatar src={currentUser.info.avatar} name="You"/>
                    </div>
                )}
                <div className="flex">
                    {users.map(({ connectionId, info }) => {
                        return (
                            <Avatar key={connectionId} src={info.avatar} name={info.name} />
                        )
                    })}
                </div>
            </div>
            <Separator orientation="vertical" className="h-6 bg-gray-400/80"/>
        </>
    )
}

interface AvatarProps {
    src: string
    name: string
}

const Avatar = ({ src, name }: AvatarProps) => {
    return (
        <div
            className="group -ml-2 flex shrink-0 justify-center items-center relative border-4 border-white rounded-full bg-gray-400"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        >
            {/* Always visible avatar image */}
            <img
                alt={name}
                src={src}
                className="size-full rounded-full object-cover"
            />

            {/* Tooltip with username, shown on hover */}
            <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 bg-black whitespace-nowrap transition-opacity z-10">
                {name}
            </div>
        </div>
    )
}
