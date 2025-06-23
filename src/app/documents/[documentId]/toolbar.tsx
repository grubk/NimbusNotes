"use client";

import { type ColorResult, SwatchesPicker, CirclePicker } from "react-color"
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from 'react';
import { Separator } from "@/components/ui/separator"
import { useEditorStore, useEditorActiveMarks } from "@/store/use-editor-store"
import { BoldIcon, HighlighterIcon, ChevronDownIcon, Code2Icon, ItalicIcon, ListTodoIcon, LucideIcon, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon, Link2Icon, ImageIcon, UploadIcon, SearchIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, ListIcon, ListOrdered, MinusIcon, PlusIcon, ListCollapseIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {type Level} from "@tiptap/extension-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LineHeightButton = () => {
    const {editor} = useEditorStore();

    const lineHeights = [
        {label: "Default", value: "normal"},
        {label: "Single", value: "1" },
        {label: "1.15", value: "1.15" },
        {label: "1.5", value: "1.5" },
        {label: "Double", value: "2" },
    ]

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <ListCollapseIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {lineHeights.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() =>{
                            editor?.chain().focus().setLineHeight(value).run()
                        }}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-sky-300/40",
                            editor?.getAttributes("paragraph").lineHeight === value && "bg-sky-300/40"
                        )}
                    >
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const FontSizeControl = () => {
  const { editor } = useEditorStore()
  const [fontSize, setFontSize] = useState("16")

  const updateFontSize = useCallback(() => {
    if (!editor) return
    const size = editor.getAttributes("textStyle")?.fontSize
    setFontSize(size?.replace("px", "") || "16")
  }, [editor])

  useEffect(() => {
    if (!editor) return

    updateFontSize()

    editor.on("selectionUpdate", updateFontSize)
    editor.on("transaction", updateFontSize)

    return () => {
      editor.off("selectionUpdate", updateFontSize)
      editor.off("transaction", updateFontSize)
    }
  }, [editor, updateFontSize])

  const applyFontSize = (newSize: string) => {
    const parsed = parseInt(newSize)
    if (!editor || isNaN(parsed) || parsed < 1) return

    const px = parsed + "px"
    editor.chain().focus().setFontSize(px).run()
    setFontSize(parsed.toString())
  }

  const changeFontSize = (delta: number) => {
    const current = parseInt(fontSize) || 16
    const newSize = Math.max(1, current + delta).toString()
    applyFontSize(newSize)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(e.target.value)
  }

  const handleInputBlur = () => {
    applyFontSize(fontSize)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  return (
    <div className="flex items-center gap-x-1 px-1.5 py-1 rounded-sm border-transparent bg-transparent text-sm w-fit">
      <button
        onClick={() => changeFontSize(-1)}
        className="p-1 hover:bg-sky-300/40 rounded-sm"
        aria-label="Decrease font size"
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={fontSize}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        className="w-10 text-center text-sm outline-none border bg-transparent border-transparent focus:border-gray-400/80 rounded-sm py-0.5"
      />
      <button
        onClick={() => changeFontSize(1)}
        className="p-1 hover:bg-sky-300/40 rounded-sm"
        aria-label="Increase font size"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  )
}

const ListButton = () => {
    const {editor} = useEditorStore();
    const lists = [
        {
            label: "Bullet list",
            icon: ListIcon,
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleBulletList().run()
        },
        {
            label: "Ordered list",
            icon: ListOrdered,
            isActive: () => editor?.isActive("orderedList"),
            onClick: () => editor?.chain().focus().toggleOrderedList().run()
        },
        {
            label: "Checklist",
            icon: ListTodoIcon,
            isActive: () => editor?.isActive("taskList"),
            onClick: () => editor?.chain().focus().toggleTaskList().run(),
            
        }
    ]

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <ListIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {lists.map(({ label, icon: Icon, onClick, isActive }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-sky-300/40",
                            isActive() && "bg-sky-300/40"
                        )}
                    >
                        <Icon className="size-4"/>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const AlignButton = () => {
    const {editor} = useEditorStore();
    const alignments = [
        {
            label: "Align Left",
            value: "left",
            icon: AlignLeftIcon
        },
        {
            label: "Align Center",
            value: "center",
            icon: AlignCenterIcon   
        },
        {
            label: "Align Right",
            value: "right",
            icon: AlignRightIcon       
        },
        {
            label: "Align Justify",
            value: "justify",
            icon: AlignJustifyIcon
        }
    ]

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <AlignLeftIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {alignments.map(({ label, value, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-sky-300/40",
                            editor?.isActive({ textAlign: value }) && "bg-sky-300/40"
                        )}
                    >
                        <Icon className="size-4"/>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const ImageButton = () => {
    const {editor} = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")

    const onChange = (src: string) => {
        editor?.chain().focus().setResizableImage({src}).run()
    }

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                onChange(imageUrl);
            }
        }

        input.click();
    }

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl)
            setImageUrl("");
            setIsDialogOpen(false);
        }
    }

    return(
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <ImageIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onUpload}>
                    <UploadIcon className="size-4 mr-2"/>
                    Upload
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    <SearchIcon className="size-4 mr-2"/>
                    Paste image URL
                </DropdownMenuItem>
            </DropdownMenuContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Insert Image URL</DialogTitle>
                        </DialogHeader>
                        <Input
                        placeholder="Insert Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleImageUrlSubmit();
                            }
                        }}
                        />
                        <DialogFooter>
                            <Button onClick={handleImageUrlSubmit}>
                                Insert
                            </Button>
                        </DialogFooter>                        
                    </DialogContent>
                </Dialog>
        </DropdownMenu>
        </>
    )
}


const LinkButton = () => {
    const {editor} = useEditorStore();
    const [value, setValue] = useState(editor?.getAttributes("link").href || "");

    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
        setValue("")
    }
    return(
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                setValue(editor?.getAttributes("link").href || "")
            }
        }}>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <Link2Icon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
                <Input
                    placeholder="https://example.com"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button onClick={() => onChange(value)}>
                    Apply
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const HighlightColorButton = () => {
    const {editor} = useEditorStore();
    const value = editor?.getAttributes("highlight").color || "#000000"
    const onChange = (color:ColorResult) => {
        editor?.chain().focus().setHighlight( {color: color.hex} ).run()
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <HighlighterIcon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
                <CirclePicker
                    color={value}
                    onChange={onChange}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const TextColorButton = () => {
    const {editor} = useEditorStore();
    const value = editor?.getAttributes("testStyle").color || "#000000"
    const onChange = (color:ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run()
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm"
                >
                    <span className="text-xs">A</span>
                    <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SwatchesPicker
                    color={value}
                    onChange={onChange}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const HeadingLevelButton = () => {
    const { editor } = useEditorStore();

    const headings = [
        {label: "Normal", value: 0, fontSize: "16px"},
        {label: "Heading 1", value: 1, fontSize: "32px"},
        {label: "Heading 2", value: 2, fontSize: "24px"},
        {label: "Heading 3", value: 3, fontSize: "20px"},
        {label: "Heading 4", value: 4, fontSize: "18px"},
    ]

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive("heading", { level })) {
                return `Heading ${level}`;
            }
        }
        return "Normal Text";
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm">
                    
                    <span className="truncate">
                        {getCurrentHeading()}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>                
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {headings.map(({ label, value, fontSize }) => (
                    <button
                        key={value}
                        style={{ fontSize }}
                        onClick={() => {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            } else {
                                editor?.chain().focus().toggleHeading({level: value as Level}).run();
                            }
                        }}
                        className={cn(
                        "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-sky-300/40",
                        (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", {level: value}) && "bg-sky-300/40",
                    )}
                    >
                        {label}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const FontFamilyButton = () => {
    const { editor } = useEditorStore();

    const fonts = [
        {label: "Arial", value: "Arial"},
        {label: "Calibri", value: "Calibri"},
        {label: "Times New Roman", value: "Times New Roman"},
        {label: "Courier New", value: "Courier New"},
        {label: "Georgia", value: "Georgia"},
        {label: "Verdana", value: "Verdana"},
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-sky-300/40 px-1.5 overflow-hidden text-sm">
                    
                    <span className="truncate">
                        {editor?.getAttributes("textStyle").fontFamily || "Arial"}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {fonts.map(({ label, value }) => (
                    <button
                    onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                    key={value}
                    className={cn(
                        "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-sky-300/40",
                        editor?.getAttributes("textStyle").fontFamily === value && "bg-sky-300/40",
                    )}
                    style={{ fontFamily: value }}
                    >
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
};

const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
}: ToolbarButtonProps) => {

    return (
        <button
            onClick={onClick}
            className={cn(
               "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-sky-300/40",
               isActive && "bg-sky-300/40" 
            )}
            >
            <Icon className = "size-4"/>
        </button>
    )
}

export const Toolbar = () => {
    const { editor } = useEditorStore();
    const activeMarks = useEditorActiveMarks(editor, ["bold", "italic", "underline", "codeBlock"]);
    console.log("Toolbar editor", { editor })
    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            },
            {
                label: "Print",
                icon: PrinterIcon,
                onClick: () => window.print(),
            },
            {
                label: "Spell Check",
                icon: SpellCheckIcon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck", current == "false" ? "true" : "false")
                }
            }
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: activeMarks.bold,
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",
                icon: ItalicIcon,
                isActive: activeMarks.italic,
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: activeMarks.underline,
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            },
        ],
        [
            /* TODO: Comment button -- maybe can add later? right now does not work.
            Source code of liveblocks may or may not be literally terrible and does not properly render
            floatingComposer, floatingThreads, or anchoredThreads, but hey, collaboration on documents works at least.
            Time wasted on this basically useless feature: 5+ hrs. Today is not a good day.
            {
                  label: "Comment",
                    icon: MessageSquarePlusIcon,
                    onClick: () => {
                        console.log("Comment button clicked");
                        console.log("Editor selection:", editor?.state.selection);
                        console.log("Selected text:", editor?.state.doc.textBetween(
                        editor.state.selection.from, 
                        editor.state.selection.to
                        ));
                        
                        const result = editor?.chain().focus().addPendingComment().run();
                        console.log("addPendingComment result:", result);
                        console.log(editor?.getJSON())
                    },
                    isActive: editor?.isActive("liveblocksCommentMark")
            },
            */
            {
                label: "Code Block",
                icon: Code2Icon,
                onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
                isActive: activeMarks.codeBlock,
            },
            {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
            },
        ],
    ];

    return (
            <div className="bg-[#f1f4f9]/70 px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto w-fit justify-center mx-auto">
                {sections[0].map((item) => (
                    <ToolbarButton key={item.label} {...item} />
                ))}
                <Separator orientation="vertical" className="h-6 bg-gray-400/80" />
                <FontFamilyButton />
                <Separator orientation="vertical" className="h-6 bg-gray-400/80" />
                <HeadingLevelButton />
                <Separator orientation="vertical" className="h-6 bg-gray-400/80" />
                <FontSizeControl />
                <Separator orientation="vertical" className="h-6 bg-gray-400/80" />
                {sections[1].map((item) => (
                    <ToolbarButton key={item.label} {...item} />
                ))}
                <TextColorButton />
                <HighlightColorButton />
                <Separator orientation="vertical" className="h-6 bg-gray-400/80" />
                <LinkButton/>
                <ImageButton />
                <AlignButton />
                <LineHeightButton />
                <ListButton />
                {sections[2].map((item) => (
                    <ToolbarButton key={item.label} {...item} />
                ))}            
            </div>
    );
};