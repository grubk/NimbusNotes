"use client"

import Image from "next/image"
import Link from "next/link"
import { DocumentInput } from "./document-input"
import { TableGrid } from "./table-grid"

import { RenameDialog } from "@/components/rename-dialog"
import { RemoveDialog } from "@/components/remove-dialog"

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Avatars } from "./avatars"
import {
    BoldIcon,
    FileIcon,
    FileJsonIcon,
    FilePenIcon,
    FilePlus,
    FileText,
    GlobeIcon,
    Italic,
    PrinterIcon,
    Redo2Icon,
    RemoveFormatting,
    Strikethrough,
    TextIcon,
    TrashIcon,
    Underline,
    Undo2Icon,
} from "lucide-react"
import { BsFilePdf } from "react-icons/bs"
import { useEditorStore } from "@/store/use-editor-store"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Doc } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TransitionDown } from "@/components/transitiondown"
import { useState } from "react"
import ReactDOM from "react-dom"

interface NavbarProps {
    data: Doc<"documents">
}

export const Navbar = ({ data }: NavbarProps) => {
    const router = useRouter()
    const { editor } = useEditorStore()

    const mutation = useMutation(api.documents.create)

    const [showTransition, setShowTransition] = useState(false)

    const onNewDocument = () => {
        mutation({
            title: "Untitled document",
        })
        .catch(() => toast.error("Something went wrong"))
        .then((id) => {
            setShowTransition(true)
            router.push(`/documents/${id}`)
        })
    }

    const onDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
    }
    const onSaveDOCX = async () => {
        if (!editor) return

        const html = editor.getHTML()

        const res = await fetch("/api/export-docx", {
            method: "POST",
            body: JSON.stringify({ html, filename: "NimbusDocument" }),
            headers: {
            "Content-Type": "application/json",
            },
        })

        if (!res.ok) {
            console.error("Failed to generate DOCX")
            return
        }

        const blob = await res.blob()
        onDownload(blob, `${data.title}.docx`)
    }

 

    const onSaveJSON = () => {
        if (!editor) return

        const content = editor.getJSON()
        const blob = new Blob([JSON.stringify(content)], {
            type: "application/json"
        })
        onDownload(blob, `${data.title}.json`)
    }

    const onSaveHTML = () => {
        if (!editor) return

        const content = editor.getHTML()
        const blob = new Blob([content], {
            type: "text/html"
        })
        onDownload(blob, `${data.title}.html`)
    }



    return (
        <>
        {/* Portal the transition overlay to document.body */}
                      {showTransition &&
                        ReactDOM.createPortal(
                          <TransitionDown
                            duration={0}
                            className="fixed top-0 left-0 w-screen h-screen z-[9999]"
                          />,
                          document.body
                        )}
        <nav className="relative h-[72px] w-full">
            {/* 🌩️ Logo fixed to the left */}
            <div className="absolute left-0 top-0 h-full flex items-center pl-4">
            <Link href="/home">
                <Image
                src="/assets/nimbuscloudfilled.png"
                alt="Logo"
                width={70}
                height={70} //TODO: change to auto so no console warning
                className="pt-2"
                />
            </Link>
            </div>

            {/* 🔲 Centered document input and menubar */}
            <div className="mx-auto h-full flex flex-col items-center justify-center w-fit">
            <DocumentInput title={data.title} id={data._id}/>
            <div className="flex">
                <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                {/* === FILE MENU === */}
                <MenubarMenu>
                    <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/40 h-auto">
                    File
                    </MenubarTrigger>
                    <MenubarContent className="print:hidden max-h-72 overflow-auto min-w-[200px]">
                    <MenubarSub>
                        <MenubarSubTrigger>
                        <FileIcon className="size-4 mr-2" />
                        Save
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                        <MenubarItem onClick={() => window.print()}>
                            <BsFilePdf className="size-4 mr-2" />
                            PDF
                        </MenubarItem>
                        <MenubarItem onClick={onSaveDOCX}>
                            <FileText className="size-4 mr-2" />
                            DOCX
                        </MenubarItem>
                        <MenubarItem onClick={onSaveJSON}>
                            <FileJsonIcon className="size-4 mr-2" />
                            JSON
                        </MenubarItem>
                        <MenubarItem onClick={onSaveHTML}>
                            <GlobeIcon className="size-4 mr-2" />
                            HTML
                        </MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarItem onClick={onNewDocument}>
                        <FilePlus className="size-4 mr-2" />
                        New Document
                    </MenubarItem>
                    <MenubarSeparator />
                    <RenameDialog documentId={data._id} initialTitle={data.title}>
                        <MenubarItem
                            onClick={(e) => e.stopPropagation()}
                            onSelect={(e) => e.preventDefault()}
                        >
                            <FilePenIcon className="size-4 mr-2" />
                            Rename
                        </MenubarItem>
                    </RenameDialog>
                    <RemoveDialog documentId={data._id}>
                        <MenubarItem
                            onClick={(e) => e.stopPropagation()}
                            onSelect={(e) => e.preventDefault()}
                        >
                            <TrashIcon className="size-4 mr-2" />
                            Remove
                        </MenubarItem>
                    </RemoveDialog>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => window.print()}>
                        <PrinterIcon className="size-4 mr-2" />
                        Print <MenubarShortcut>Ctrl+P</MenubarShortcut>
                    </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                {/* === EDIT MENU === */}
                <MenubarMenu>
                    <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/40 h-auto">
                    Edit
                    </MenubarTrigger>
                    <MenubarContent>
                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                        <Undo2Icon className="size-4 mr-2" />
                        Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                        <Redo2Icon className="size-4 mr-2" />
                        Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                    </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>

                {/* === INSERT MENU === */}
                <MenubarMenu>
                    <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/40 h-auto">
                    Insert
                    </MenubarTrigger>
                    <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger>Table</MenubarSubTrigger>
                        <MenubarSubContent className="p-0">
                        <div className="p-0">
                            <TableGrid onSelect={(rows, cols) =>
                            editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run()
                            } />
                        </div>
                        </MenubarSubContent>
                    </MenubarSub>
                    </MenubarContent>
                </MenubarMenu>

                {/* === FORMAT MENU === */}
                <MenubarMenu>
                    <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted/40 h-auto">
                    Format
                    </MenubarTrigger>
                    <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger>
                        <TextIcon className="size-4 mr-2" />
                        Text
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                        <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                            <BoldIcon className="size-4 mr-2" />
                            Bold <MenubarShortcut>Ctrl+B</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                            <Italic className="size-4 mr-2" />
                            Italic <MenubarShortcut>Ctrl+I</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                            <Underline className="size-4 mr-2" />
                            Underline <MenubarShortcut>Ctrl+U</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                            <Strikethrough className="size-4 mr-2" />
                            Strikethrough <MenubarShortcut>Ctrl+S</MenubarShortcut>
                        </MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                        <RemoveFormatting className="size-4 mr-2" />
                        Clear Formatting
                    </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                </Menubar>
            </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 items-center scale-125 pr-5">
                <Avatars />
                <OrganizationSwitcher
                    afterCreateOrganizationUrl="/home"
                    afterLeaveOrganizationUrl="/home"
                    afterSelectOrganizationUrl="/home"
                    afterSelectPersonalUrl="/home"
                />
                <UserButton />
            </div>
        </nav>
        </>
        )
}
