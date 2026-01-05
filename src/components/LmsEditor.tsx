"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface LmsEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function LmsEditor({ value, onChange }: LmsEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[260px] px-3 py-2 outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // keep external value in sync when editing existing article
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-black">
      {/* simple toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-white/10 bg-black/40 px-2 py-1 text-[11px]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("bold") ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("italic") ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("bulletList") ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("orderedList") ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("paragraph") ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          P
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-white/20"
              : "hover:bg-white/10"
          }`}
        >
          H2
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
