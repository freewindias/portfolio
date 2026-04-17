"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Undo, Redo, Heading1, Heading2, Heading3 } from "lucide-react"
import { Button } from "./button"
import { useEffect } from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/40 rounded-t-md">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-muted' : ''}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-8 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-8 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-muted' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <div className="w-[1px] h-8 bg-border mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function RichTextEditor({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] max-h-[400px] overflow-y-auto w-full p-4 focus-visible:outline-none focus:ring-0 prose prose-sm dark:prose-invert max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep content synced if value changes externally (e.g. form reset or initial data load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      <style>{`
        /* Minimal fallback for Tiptap structure in case Tailwind Typography isn't available */
        .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .tiptap li p { margin-top: 0.25rem; margin-bottom: 0.25rem; }
        .tiptap blockquote { border-left: 3px solid #ccc; padding-left: 1rem; margin-left: 0; font-style: italic; }
        .tiptap h1 { max-width: 100%; font-size: 2em; margin-top: 0.67em; margin-bottom: 0.67em; font-weight: bold; }
        .tiptap h2 { max-width: 100%; font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; font-weight: bold; }
        .tiptap h3 { max-width: 100%; font-size: 1.17em; margin-top: 1em; margin-bottom: 1em; font-weight: bold; }
      `}</style>
      <div className="flex flex-col border rounded-md bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary overflow-hidden">
        <MenuBar editor={editor} />
        <div className="flex-1 w-full flex flex-col">
          <EditorContent editor={editor} className="tiptap" />
        </div>
      </div>
    </div>
  );
}
