"use client";

import { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface LmsEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function LmsEditorInner({ value, onChange }: LmsEditorProps) {
  const editorRef = useRef<any>(null);

  // keep external value in sync when editing an existing article
  useEffect(() => {
    if (!editorRef.current) return;
    const current = editorRef.current.getContent({ format: "html" }) || "";
    if (current !== (value || "")) {
      editorRef.current.setContent(value || "");
    }
  }, [value]);

  return (
    <div className="rounded-lg border border-white/10 bg-black/20">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        init={{
          height: 360,
          menubar: false,
          statusbar: true,
          skin: "oxide-dark",
          content_css: "dark",
          // no image / media plugins
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "table",
            "help",
            "wordcount",
          ],
          // Toolbar WITHOUT image / media buttons
          toolbar:
            "undo redo | formatselect | " +
            "bold italic underline | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | link | " +
            "code fullscreen | help",
          branding: false,
          resize: true,
        }}
        onEditorChange={(content) => onChange(content)}
      />
    </div>
  );
}
