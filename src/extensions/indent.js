import { Extension } from '@tiptap/core'
import { TextSelection, AllSelection, Plugin } from 'prosemirror-state'

export const clamp = (val, min, max) => {
  if (val < min) return min
  if (val > max) return max
  return val
}

const IndentProps = {
  min: 0,
  max: 210,
  more: 30,
  less: -30,
}

export function isBulletListNode(node) {
  return node.type.name === 'bulletList'  // changed from 'bullet_list'
}

export function isOrderedListNode(node) {
  return node.type.name === 'orderedList' // changed from 'order_list'
}

export function isTodoListNode(node) {
  return node.type.name === 'todoList'
}

export function isListNode(node) {
  return isBulletListNode(node) || isOrderedListNode(node) || isTodoListNode(node)
}

function setNodeIndentMarkup(tr, pos, delta) {
  if (!tr.doc) return tr

  const node = tr.doc.nodeAt(pos)
  if (!node) return tr

  const indent = clamp((node.attrs.indent || 0) + delta, IndentProps.min, IndentProps.max)

  if (indent === node.attrs.indent) return tr

  const nodeAttrs = { ...node.attrs, indent }

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks)
}

const updateIndentLevel = (tr, delta) => {
  const { doc, selection } = tr
  if (!doc || !selection) return tr

  if (!(selection instanceof TextSelection || selection instanceof AllSelection)) return tr

  const { from, to } = selection

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type
    if (nodeType.name === 'paragraph' || nodeType.name === 'heading') {
      tr = setNodeIndentMarkup(tr, pos, delta)
      return false
    }
    if (isListNode(node)) {
      // don't indent the list itself here — handled by sink/lift commands
      return false
    }
    return true
  })

  return tr
}

export const Indent = Extension.create({
  name: 'indent',

  addOptions: {
    types: ['heading', 'paragraph'],
    indentLevels: [0, 30, 60, 90, 120, 150, 180, 210],
    defaultIndentLevel: 0,
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            renderHTML: attributes => ({
              style: `margin-left: ${attributes.indent}px!important`,
            }),
            parseHTML: element => parseInt(element.style.marginLeft) || this.options.defaultIndentLevel,
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }) => {
        tr = tr.setSelection(state.selection)
        tr = updateIndentLevel(tr, IndentProps.more)
        if (tr.docChanged) {
          if (dispatch) dispatch(tr)
          return true
        }
        return false
      },
      outdent: () => ({ tr, state, dispatch }) => {
        tr = tr.setSelection(state.selection)
        tr = updateIndentLevel(tr, IndentProps.less)
        if (tr.docChanged) {
          if (dispatch) dispatch(tr)
          return true
        }
        return false
      },
    }
  },

  addKeyboardShortcuts() {
    const isAtLineStart = () => {
      const { state } = this.editor
      const { $from } = state.selection
      return $from.parentOffset === 0
    }

    return {
      Tab: () => {
        const { commands } = this.editor
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          // Inside list? Nest list item
          return commands.sinkListItem('listItem')
        }
        if (isAtLineStart()) {
          // Outside list? Indent paragraph/heading at line start only
          return commands.indent()
        }
        return false
      },

      'Shift-Tab': () => {
        const { commands } = this.editor
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          // Inside list? Un-nest list item
          return commands.liftListItem('listItem')
        }
        if (isAtLineStart()) {
          // Outside list? Outdent paragraph/heading at line start only
          return commands.outdent()
        }
        return false
      },

      Backspace: () => {
        const { state, commands } = this.editor
        const { selection } = state
        const { $from } = selection

        if ($from.parentOffset === 0) {
          if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
            // Backspace at start inside list lifts item
            return commands.liftListItem('listItem')
          }
          const indent = $from.parent.attrs.indent || 0
          if (indent > 0) {
            // Backspace at start of indented paragraph/heading outdents
            return commands.outdent()
          }
        }
        return false
      },
      Enter: () => {
        // We can remove this Enter shortcut since we'll handle with the plugin below
        return false
      },
    }
  },

  addInputRules() {
    return []
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            beforeinput: (view, event) => {
              if (event.inputType === 'insertParagraph') {
                const { state, dispatch } = view
                const { $from } = state.selection
                const node = $from.node($from.depth)
                if ((node.type.name === 'paragraph' || node.type.name === 'heading') && (node.attrs.indent || 0) > 0) {
                  const tr = state.tr.setNodeMarkup($from.before(), undefined, {
                    ...node.attrs,
                    indent: 0,
                  })
                  dispatch(tr)
                }
              }
              return false
            },
          },
        },
      }),
    ]
  },
})
