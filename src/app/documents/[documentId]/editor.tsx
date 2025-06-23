"use client";

import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { ResizableImage } from 'tiptap-extension-resizable-image';
import 'tiptap-extension-resizable-image/styles.css';
import FontFamily from '@tiptap/extension-font-family'
import { TextStyle, FontSize } from '@tiptap/extension-text-style'
import { useEditor, EditorContent } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { LineHeightExtension } from '@/extensions/line-height'
import { Indent } from '@/extensions/indent'
import StarterKit from '@tiptap/starter-kit'

import { useEditorStore } from '@/store/use-editor-store'
import { Ruler } from './ruler';
import { useLiveblocksExtension } from "@liveblocks/react-tiptap"
import { Threads } from './threads';
import { useStorage } from '@liveblocks/react';

// initialize languages in lowlight
const lowlight = createLowlight(all)

//disable spellcheck in code blocks
export const noSpellcheckCodeBlockLowlight = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      spellcheck: {
        default: false,
        renderHTML: () => {
          return {
            spellcheck: 'false',
          }
        },
      },
    }
  },
})

const CustomCodeBlockLowlight = noSpellcheckCodeBlockLowlight.configure({
  lowlight,
  exitOnTripleEnter: false
})


export const Editor = () => {
    const leftMargin = useStorage((root) => root.leftMargin)
    const rightMargin = useStorage((root) => root.rightMargin)

    const { setEditor } = useEditorStore();
    const liveblocks = useLiveblocksExtension({
      offlineSupport_experimental: true
    })

  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) {
        setEditor(editor);
    },
    onDestroy() {
        setEditor(null);
    },
    onUpdate({ editor }) {
        setEditor(editor)
    },
    onSelectionUpdate({ editor }) {
        setEditor(editor)
    },
    onTransaction({ editor }) {
        setEditor(editor)
    }, 
    onBlur({ editor }) {
        setEditor(editor)
    },
    onContentError({ editor }) {
        setEditor(editor)
    },
    editorProps: {
        attributes: {
            style: `padding-left: ${leftMargin ?? 56}px; padding-right: ${rightMargin ?? 56}px;`,
            class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text"
        },
    },
    extensions: [
        StarterKit.configure({
          history: false,
          codeBlock: false
        }),
        liveblocks,
        Indent,
        LineHeightExtension.configure({
          types: ["heading", "paragraph"],
          defaultLineHeight: "normal",
        }),
        FontSize.configure({
          types: ['textStyle']
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"]
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https"
        }),
        FontFamily,
        Highlight.configure({
          multicolor:true
        }),
        Color,
        TextStyle,
        Underline,
        TaskItem.configure({
            nested: true
        }),
        TaskList,
        CustomCodeBlockLowlight,
        Table,
        TableCell,
        TableHeader,
        TableRow,
        ResizableImage.configure({
        defaultWidth: 400,
        defaultHeight: 400,
      }),

    ],
  content: ``,


      
  })
    return (
      <div className="size-full overflow-x-auto bg-[#F9FBFD] z-0 px-4 mt-4 print:p-0 print:bg-white print:overflow-visible">
        <Ruler />
        <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0 relative">

          <EditorContent editor={editor} />
          <Threads editor={editor} />
        </div>
      </div>
    );
};

