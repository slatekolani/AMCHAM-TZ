import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
    const editor = useEditor({
        extensions: [StarterKit, Link.configure({ openOnClick: false })],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    if (!editor) {
        return null;
    }

    const button = (label: string, action: () => void, active: boolean) => (
        <button
            type="button"
            onClick={action}
            className={'px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] ' + (active ? 'bg-[#14234a] text-white' : 'bg-white text-[#14234a]')}
        >
            {label}
        </button>
    );

    return (
        <div className="border border-[#d7c8a9] bg-white">
            <div className="flex flex-wrap gap-1 border-b border-[#d7c8a9] bg-[#fbf8f0] p-2">
                {button('Bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
                {button('Italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
                {button('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
                {button('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
                {button('Bullets', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
                {button('Numbered', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
                {button('Quote', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
            </div>
            <EditorContent editor={editor} className="prose max-w-none p-4 [&_.ProseMirror]:min-h-[240px] [&_.ProseMirror]:outline-none" />
        </div>
    );
}
