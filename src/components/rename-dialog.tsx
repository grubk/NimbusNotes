"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import { Id } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useState } from "react"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface RenameDialogProps {
    documentId: Id<"documents">
    initialTitle: string
    children: React.ReactNode
}

export const RenameDialog = ({ documentId, initialTitle, children }: RenameDialogProps) => {
    const update = useMutation(api.documents.updateById)
    const [isUpdating, setIsUpdating] = useState(false)

    const [title, setTitle] = useState(initialTitle)
    const [open, setOpen] = useState(false)

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUpdating(true)

        update({ id:documentId, title: title.trim() || "Untitled Document" })
            .then(() => toast.success("Document renamed."))
            .catch(() => toast.error("A document can only be modified by its original creator."))
            .then(() => setOpen(false))
            .finally(() => {
                setIsUpdating(false)
            })
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Rename document</DialogTitle>
                        <DialogDescription>
                            Enter a new name for your document.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="my-4">
                        <Input
                            placeholder="Eg. Java Notes (ew)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            className=""
                            type="button"
                            variant="ghost"
                            disabled={isUpdating}
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="bg-blue-500 outline-none text-white hover:bg-blue-600"
                            type="submit"
                            disabled={isUpdating}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}