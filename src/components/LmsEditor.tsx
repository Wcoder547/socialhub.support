"use client";

import dynamic from "next/dynamic";

const LmsEditorInner = dynamic(() => import("./LmsEditorInner"), {
  ssr: false,
});

interface LmsEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function LmsEditor(props: LmsEditorProps) {
  return <LmsEditorInner {...props} />;
}
