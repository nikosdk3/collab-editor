import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";

const Toolbar = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;

      return {
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isStrike: ctx.editor.isActive("strike"),
        isCode: ctx.editor.isActive("code"),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        isBlockquote: ctx.editor.isActive("blockquote"),
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
      };
    },
  });

  if (!editor || !editorState) {
    return null;
  }

  const iconSize = 18;

  const toolbarButtons = [
    {
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editorState.isBold,
      icon: <Bold size={iconSize} />,
    },
    {
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editorState.isItalic,
      icon: <Italic size={iconSize} />,
    },
    {
      label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editorState.isStrike,
      icon: <Strikethrough size={iconSize} />,
    },
    {
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editorState.isCode,
      icon: <Code size={iconSize} />,
    },
    {
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editorState.isHeading1,
      icon: <Heading1 size={iconSize} />,
    },
    {
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editorState.isHeading2,
      icon: <Heading2 size={iconSize} />,
    },
    {
      label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editorState.isHeading3,
      icon: <Heading3 size={iconSize} />,
    },
    {
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editorState.isBulletList,
      icon: <List size={iconSize} />,
    },
    {
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editorState.isOrderedList,
      icon: <ListOrdered size={iconSize} />,
    },
    {
      label: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editorState.isCodeBlock,
      icon: <Code2 size={iconSize} />,
    },
    {
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editorState.isBlockquote,
      icon: <Quote size={iconSize} />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 p-2">
      {toolbarButtons.map((button, index) => (
        <button
          key={index}
          onClick={button.action}
          className={`rounded border px-3 py-1.5 text-sm transition-colors ${
            button.isActive
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          }`}
          title={button.label}
        >
          {button.icon}
        </button>
      ))}

      <div className="grow" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        className="flex items-center justify-center rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="Undo"
      >
        <Undo2 size={iconSize} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        className="flex items-center justify-center rounded border border-gray-300 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        title="Redo"
      >
        <Redo2 size={iconSize} />
      </button>
    </div>
  );
};

export default Toolbar;
