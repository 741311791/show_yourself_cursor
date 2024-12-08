"use client"

import { Editor, useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Link as LinkIcon, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Heading1, Heading2 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link')
      .setLink({ href: url, target: '_blank' }).run()
  }

  return (
    <div className="border-b border-border p-2 flex flex-wrap items-center gap-1">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('heading', { level: 1 }) && "bg-accent text-accent-foreground"
        )}
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('heading', { level: 2 }) && "bg-accent text-accent-foreground"
        )}
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('bold') && "bg-accent text-accent-foreground"
        )}
        title="加粗"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('italic') && "bg-accent text-accent-foreground"
        )}
        title="斜体"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('underline') && "bg-accent text-accent-foreground"
        )}
        title="下划线"
      >
        <UnderlineIcon size={16} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive({ textAlign: 'left' }) && "bg-accent text-accent-foreground"
        )}
        title="左对齐"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive({ textAlign: 'center' }) && "bg-accent text-accent-foreground"
        )}
        title="居中对齐"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive({ textAlign: 'right' }) && "bg-accent text-accent-foreground"
        )}
        title="右对齐"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('bulletList') && "bg-accent text-accent-foreground"
        )}
        title="无序列表"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('orderedList') && "bg-accent text-accent-foreground"
        )}
        title="有序列表"
      >
        <ListOrdered size={16} />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      <button
        onClick={addLink}
        className={cn(
          "p-2 rounded transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          editor.isActive('link') && "bg-accent text-accent-foreground"
        )}
        title="添加链接"
      >
        <LinkIcon size={16} />
      </button>
    </div>
  )
}

interface RichTextEditorProps {
  content?: string
  onChange?: (html: string) => void
  isEditing?: boolean
}

export function RichTextEditor({ 
  content = '', 
  onChange,
  isEditing = true
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: cn(
            "text-primary hover:underline",
            "dark:text-primary-foreground"
          ),
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "dark:prose-invert",
          "prose-headings:text-foreground",
          "prose-p:text-foreground",
          "prose-strong:text-foreground",
          "prose-em:text-foreground",
          "prose-li:text-foreground"
        ),
      },
    },
  })

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {isEditing && <MenuBar editor={editor} />}
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[120px]"
      />
    </div>
  )
} 