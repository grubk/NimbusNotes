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

//disable spellcheck in code blocks and fix browser compatibility
export const noSpellcheckCodeBlockLowlight = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      spellcheck: {
        default: false,
        renderHTML: () => {
          return {
            spellcheck: 'false',
            contenteditable: 'true',
          }
        },
        parseHTML: () => false,
      },
    }
  },
  
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('pre')
      const contentDOM = document.createElement('code')
      
      // Set attributes for better browser compatibility
      dom.setAttribute('spellcheck', 'false')
      dom.setAttribute('data-language', node.attrs.language || 'null')
      contentDOM.setAttribute('spellcheck', 'false')
      contentDOM.setAttribute('contenteditable', 'true')
      
      // Prevent browser auto-formatting
      contentDOM.style.whiteSpace = 'pre'
      contentDOM.style.fontFamily = 'monospace'
      
      dom.appendChild(contentDOM)
      
      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false
          if (updatedNode.attrs.language !== node.attrs.language) {
            dom.setAttribute('data-language', updatedNode.attrs.language || 'null')
          }
          return true
        }
      }
    }
  }
})

const CustomCodeBlockLowlight = noSpellcheckCodeBlockLowlight.configure({
  lowlight,
  exitOnTripleEnter: false,
  HTMLAttributes: {
    spellcheck: 'false',
    class: 'hljs'
  }
})


export const Editor = () => {
    const leftMargin = useStorage((root) => root.leftMargin)
    const rightMargin = useStorage((root) => root.rightMargin)

    const { setEditor } = useEditorStore();
    const liveblocks = useLiveblocksExtension({
      offlineSupport_experimental: true
    })

    // Calculate max width for images based on margins
    const imageMaxWidth = 816 - (leftMargin ?? 56) - (rightMargin ?? 56)

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
            style: `padding-left: ${leftMargin ?? 56}px; padding-right: ${rightMargin ?? 56}px; --left-margin: ${leftMargin ?? 56}px; --right-margin: ${rightMargin ?? 56}px;`,
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
        defaultWidth: Math.min(400, imageMaxWidth),
        defaultHeight: 400,
        maxWidth: imageMaxWidth, // Constrain to available width between margins
        allowBase64: true,
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

