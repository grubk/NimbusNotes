import { create } from "zustand";
import { type Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
}));

//Actively update buttons (bold, italic, etc.) when selected text is in said state
export function useEditorActiveMarks(editor: Editor | null, formats: string[]) {
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const newStates: Record<string, boolean> = {};
      let hasChanged = false;

      formats.forEach((format) => {
        const isActive = editor.isActive(format);
        newStates[format] = isActive;

        if (activeStates[format] !== isActive) {
          hasChanged = true;
        }
      });

      if (hasChanged) {
        setActiveStates(newStates);
      }
    };

    update();

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor, formats, activeStates]);

  return activeStates;
}