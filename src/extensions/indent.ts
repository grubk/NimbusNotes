import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, EditorState, Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

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
  lineIndents: Map<number, number>
  decorations: DecorationSet
}>('indent')

// Helper function to get the start position of a line
const getLineStart = (state: EditorState, pos: number): number => {
  const $pos = state.doc.resolve(pos)
  let lineStart = $pos.start($pos.depth)

  // Walk backwards to find the actual start of the text line
  const node = $pos.parent
  const nodeStart = $pos.start($pos.depth)

  for (let i = $pos.parentOffset - 1; i >= 0; i--) {
    const char = node.textContent[i]
    if (char === '\n') {
      lineStart = nodeStart + i + 1
      break
    }
  }

  return lineStart
}

// Helper function to create indentation decoration
const createIndentDecoration = (pos: number, level: number) => {
  return Decoration.widget(
    pos,
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
      types: ['paragraph', 'heading'],
      indentStep: 1,
      maxIndent: 8,
    }
  },

  addCommands() {
    return {
      indentLine: () => ({ tr, state, dispatch }: {
        tr: Transaction
        state: EditorState
        dispatch?: (tr: Transaction) => void
      }) => {
        const { selection } = state
        const lineStart = getLineStart(state, selection.from)

        const plugin = indentPluginKey.getState(state)
        if (!plugin) return false

        const currentIndent = plugin.lineIndents.get(lineStart) || 0
        const newIndent = clamp(
          currentIndent + this.options.indentStep,
          0,
          this.options.maxIndent
        )

        if (newIndent === currentIndent) return false

        if (dispatch) {
          const newLineIndents = new Map(plugin.lineIndents)
          newLineIndents.set(lineStart, newIndent)

          // Update decorations
          const decorations = plugin.decorations.remove(
            plugin.decorations.find(lineStart, lineStart)
          )
          const newDecorations =
            newIndent > 0
              ? decorations.add(tr.doc, [createIndentDecoration(lineStart, newIndent)])
              : decorations

          tr.setMeta(indentPluginKey, {
            lineIndents: newLineIndents,
            decorations: newDecorations,
          })
        }

        return true
      },

      outdentLine: () => ({ tr, state, dispatch }: {
        tr: Transaction
        state: EditorState
        dispatch?: (tr: Transaction) => void
      }) => {
        const { selection } = state
        const lineStart = getLineStart(state, selection.from)

        const plugin = indentPluginKey.getState(state)
        if (!plugin) return false

        const currentIndent = plugin.lineIndents.get(lineStart) || 0
        if (currentIndent === 0) return false

        const newIndent = clamp(
          currentIndent - this.options.indentStep,
          0,
          this.options.maxIndent
        )

        if (dispatch) {
          const newLineIndents = new Map(plugin.lineIndents)
          if (newIndent === 0) {
            newLineIndents.delete(lineStart)
          } else {
            newLineIndents.set(lineStart, newIndent)
          }

          // Update decorations
          const decorations = plugin.decorations.remove(
            plugin.decorations.find(lineStart, lineStart)
          )
          const newDecorations =
            newIndent > 0
              ? decorations.add(tr.doc, [createIndentDecoration(lineStart, newIndent)])
              : decorations

          tr.setMeta(indentPluginKey, {
            lineIndents: newLineIndents,
            decorations: newDecorations,
          })
        }

        return true
      },
    }
  },

  addKeyboardShortcuts() {
    const isAtLineStart = (): boolean => {
      const { state } = this.editor
      const { selection } = state
      const lineStart = getLineStart(state, selection.from)
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
      const lineStart = getLineStart(state, selection.from)
      const plugin = indentPluginKey.getState(state)
      return plugin ? (plugin.lineIndents.get(lineStart) || 0) > 0 : false
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
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: indentPluginKey,
        state: {
          init() {
            return {
              lineIndents: new Map<number, number>(),
              decorations: DecorationSet.empty,
            }
          },
          apply(tr, pluginState) {
            const { lineIndents, decorations } = pluginState

            // Check if we have meta updates
            const meta = tr.getMeta(indentPluginKey)
            if (meta) {
              return meta
            }

            // Map decorations through document changes
            const newDecorations = decorations.map(tr.mapping, tr.doc)

            // Update line positions due to document changes
            const newLineIndents = new Map<number, number>()
            for (const [pos, level] of lineIndents) {
              const newPos = tr.mapping.map(pos)
              if (newPos !== null) {
                newLineIndents.set(newPos, level)
              }
            }

            return {
              lineIndents: newLineIndents,
              decorations: newDecorations,
            }
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