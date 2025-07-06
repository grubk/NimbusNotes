import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Node } from 'prosemirror-model'

export const clamp = (val: number, min: number, max: number): number => {
  if (val < min) return min
  if (val > max) return max
  return val
}

interface IndentOptions {
  types: string[]
  indentStep: number
  maxIndent: number
}

const indentPluginKey = new PluginKey<{
  decorations: DecorationSet
}>('indent')

// Helper function to get the line number within a node
const getLineNumber = (state: EditorState, pos: number): { nodePos: number, lineIndex: number } => {
  const $pos = state.doc.resolve(pos)
  const node = $pos.parent
  
  // Count newlines from node start to current position
  let lineIndex = 0
  const textToPos = node.textContent.slice(0, $pos.parentOffset)
  
  for (let i = 0; i < textToPos.length; i++) {
    if (textToPos[i] === '\n') {
      lineIndex++
    }
  }
  
  // Safety check: if we're at the top level (depth 0), use position 0
  const nodePos = $pos.depth > 0 ? $pos.before($pos.depth) : 0
  
  return { nodePos, lineIndex }
}

// Helper function to get line start position within a node
const getLineStartInNode = (node: Node, lineIndex: number): number => {
  if (lineIndex === 0) return 0
  
  let currentLine = 0
  for (let i = 0; i < node.textContent.length; i++) {
    if (node.textContent[i] === '\n') {
      currentLine++
      if (currentLine === lineIndex) {
        return i + 1
      }
    }
  }
  return node.textContent.length
}

// Helper function to create indentation decoration
const createIndentDecoration = (nodeStart: number, lineOffset: number, level: number) => {
  return Decoration.widget(
    nodeStart + lineOffset,
    () => {
      const span = document.createElement('span')
      span.style.marginLeft = `${level * 2}rem`
      span.style.display = 'inline-block'
      span.style.width = '0'
      return span
    },
    { side: -1 }
  )
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indentLine: () => ReturnType
      outdentLine: () => ReturnType
    }
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'codeBlock'],
      indentStep: 1,
      maxIndent: 8,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineIndents: {
            default: {},
            renderHTML: () => ({}),
            parseHTML: () => ({}),
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indentLine: () => ({ tr, state, dispatch }: {
        tr: Transaction
        state: EditorState
        dispatch?: (tr: Transaction) => void
      }) => {
        const { selection } = state
        const { nodePos, lineIndex } = getLineNumber(state, selection.from)
        
        const $pos = state.doc.resolve(selection.from)
        const node = $pos.parent
        const currentLineIndents = node.attrs.lineIndents || {}
        const currentIndent = currentLineIndents[lineIndex] || 0
        
        const newIndent = clamp(
          currentIndent + this.options.indentStep,
          0,
          this.options.maxIndent
        )

        if (newIndent === currentIndent) return false

        if (dispatch) {
          const updatedLineIndents = { ...currentLineIndents, [lineIndex]: newIndent }
          
          tr.setNodeMarkup(nodePos, node.type, { ...node.attrs, lineIndents: updatedLineIndents }, node.marks)
        }

        return true
      },

      outdentLine: () => ({ tr, state, dispatch }: {
        tr: Transaction
        state: EditorState
        dispatch?: (tr: Transaction) => void
      }) => {
        const { selection } = state
        const { nodePos, lineIndex } = getLineNumber(state, selection.from)
        
        const $pos = state.doc.resolve(selection.from)
        const node = $pos.parent
        const currentLineIndents = node.attrs.lineIndents || {}
        const currentIndent = currentLineIndents[lineIndex] || 0
        
        if (currentIndent === 0) return false

        const newIndent = clamp(
          currentIndent - this.options.indentStep,
          0,
          this.options.maxIndent
        )

        if (dispatch) {
          const updatedLineIndents = { ...currentLineIndents }
          
          if (newIndent === 0) {
            delete updatedLineIndents[lineIndex]
          } else {
            updatedLineIndents[lineIndex] = newIndent
          }
          
          tr.setNodeMarkup(nodePos, node.type, { ...node.attrs, lineIndents: updatedLineIndents }, node.marks)
        }

        return true
      },
    }
  },

  addKeyboardShortcuts() {
    const isAtLineStart = (): boolean => {
      const { state } = this.editor
      const { selection } = state
      const { lineIndex } = getLineNumber(state, selection.from)
      const $pos = state.doc.resolve(selection.from)
      const node = $pos.parent
      const lineStart = $pos.start($pos.depth) + getLineStartInNode(node, lineIndex)
      return selection.from === lineStart
    }

    const isInList = (): boolean => {
      return (
        this.editor.isActive('bulletList') ||
        this.editor.isActive('orderedList') ||
        this.editor.isActive('todoList')
      )
    }

    const hasLineIndent = (): boolean => {
      const { state } = this.editor
      const { selection } = state
      const { lineIndex } = getLineNumber(state, selection.from)
      const $pos = state.doc.resolve(selection.from)
      const node = $pos.parent
      const lineIndents = node.attrs.lineIndents || {}
      return (lineIndents[lineIndex] || 0) > 0
    }

    return {
      Tab: () => {
        // If in a list, use default list behavior
        if (isInList()) {
          return this.editor.commands.sinkListItem('listItem')
        }

        // Only indent if at the beginning of the line
        if (isAtLineStart()) {
          return this.editor.commands.indentLine()
        }

        return false
      },

      'Shift-Tab': () => {
        // If in a list, use default list behavior
        if (isInList()) {
          return this.editor.commands.liftListItem('listItem')
        }

        // Outdent can be used anywhere on the line if it has indentation
        if (hasLineIndent()) {
          return this.editor.commands.outdentLine()
        }

        return false
      },

      Backspace: () => {
        // Only handle backspace at the beginning of the line
        if (isAtLineStart()) {
          // If in a list, use default list behavior
          if (isInList()) {
            return this.editor.commands.liftListItem('listItem')
          }

          // If the current line has indentation, remove it
          if (hasLineIndent()) {
            return this.editor.commands.outdentLine()
          }
        }

        return false
      },

      // IMPORTANT: Preserve logic that removes indent when entering new line
      Enter: () => {
        const { state } = this.editor
        const { selection } = state
        const { lineIndex } = getLineNumber(state, selection.from)
        const $pos = state.doc.resolve(selection.from)
        const node = $pos.parent
        const lineIndents = node.attrs.lineIndents || {}
        
        // If current line has indent, remove it after Enter
        if (lineIndents[lineIndex]) {
          // Let the default Enter behavior happen first, then remove indent
          setTimeout(() => {
            const newState = this.editor.state
            const newSelection = newState.selection
            const newLineInfo = getLineNumber(newState, newSelection.from)
            const newPos = newState.doc.resolve(newSelection.from)
            const newNode = newPos.parent
            const newLineIndents = newNode.attrs.lineIndents || {}
            
            if (newLineIndents[newLineInfo.lineIndex]) {
              const updatedLineIndents = { ...newLineIndents }
              delete updatedLineIndents[newLineInfo.lineIndex]
              
              const tr = newState.tr
              tr.setNodeMarkup(newLineInfo.nodePos, newNode.type, { ...newNode.attrs, lineIndents: updatedLineIndents }, newNode.marks)
              this.editor.view.dispatch(tr)
            }
          }, 0)
        }
        
        return false // Let default Enter behavior proceed
      },
    }
  },

  addProseMirrorPlugins() {
    const options = this.options
    
    return [
      new Plugin({
        key: indentPluginKey,
        state: {
          init(config, state) {
            // Create decorations from node attributes
            const decorations: Decoration[] = []
            
            state.doc.descendants((node, pos) => {
              if (options.types.includes(node.type.name) && node.attrs.lineIndents) {
                Object.entries(node.attrs.lineIndents).forEach(([lineIndex, level]) => {
                  const lineOffset = getLineStartInNode(node, parseInt(lineIndex))
                  decorations.push(createIndentDecoration(pos + 1, lineOffset, level as number))
                })
              }
            })

            return {
              decorations: DecorationSet.create(state.doc, decorations),
            }
          },
          apply(tr, pluginState) {
            // Recreate decorations on any document change
            if (tr.docChanged) {
              const decorations: Decoration[] = []
              
              tr.doc.descendants((node, pos) => {
                if (options.types.includes(node.type.name) && node.attrs.lineIndents) {
                  Object.entries(node.attrs.lineIndents).forEach(([lineIndex, level]) => {
                    const lineOffset = getLineStartInNode(node, parseInt(lineIndex))
                    decorations.push(createIndentDecoration(pos + 1, lineOffset, level as number))
                  })
                }
              })

              return {
                decorations: DecorationSet.create(tr.doc, decorations),
              }
            }

            return pluginState
          },
        },
        props: {
          decorations(state) {
            return indentPluginKey.getState(state)?.decorations
          },
        },
      }),
    ]
  },

  addStorage() {
    return {
      indentLevels: Array.from({ length: this.options.maxIndent + 1 }, (_, i) => i),
    }
  },
})