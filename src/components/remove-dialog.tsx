"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Id } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RemoveDialogProps {
    documentId: Id<"documents">
    children: React.ReactNode
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
    const router = useRouter()
    const remove = useMutation(api.documents.removeById)
    const [isRemoving, setIsRemoving] = useState(false)


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone and will permanently delete your document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={(e) => e.stopPropagation()}
                        className="border-0 shadow-none focus:outline-none"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-400 outline-none text-white hover:bg-red-500"
                        disabled={isRemoving}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsRemoving(true)
                            remove({ id: documentId })
                                .then(() => {
                                    toast.success("Document removed.")
                                    router.push("/home")
                                })                            
                                .catch(() => toast.error("A document can only be deleted by its original creator."))
                                .finally(() => setIsRemoving(false))
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}