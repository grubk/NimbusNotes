import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import {
  AnchoredThreads,
  FloatingComposer,
  FloatingThreads,
} from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";

export const Threads = ({ editor }: { editor: Editor | null }) => {
  return(
    <ClientSideSuspense fallback={null}>
      <ThreadsList editor={editor}/>
    </ClientSideSuspense>
  )
}

export function ThreadsList ({ editor }: { editor: Editor | null }) {
  const { threads } = useThreads({ query: { resolved: false } });

  return (
    <>
      {!editor || !threads ? (
        // You can show a loading placeholder or just nothing
        null
      ) : (
        <>
          <div className="anchored-threads z-[99999]">
            <AnchoredThreads editor={editor} threads={threads} />
          </div>
          <FloatingThreads
            editor={editor}
            threads={threads}
            className="floating-threads"
          />
          <FloatingComposer editor={editor} />
        </>
      )}
    </>
  );
}
