/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { BubbleMenu, BubbleMenuProps, isTextSelection } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  LucideIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { allowedLogoAlignment } from "../nodes/logo";
import { BubbleMenuButton } from "./bubble-menu-button";
import React from "react";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  shouldShow?: () => boolean;
  icon?: LucideIcon;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export function EditorBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const icons = [AlignLeftIcon, AlignCenterIcon, AlignRightIcon];
  const alignmentItems: BubbleMenuItem[] = allowedLogoAlignment.map(
    (alignment, index) => ({
      name: alignment,
      isActive: () => editor?.isActive({ textAlign: alignment })!,
      command: () => {
        if (props?.editor?.isActive({ textAlign: alignment })) {
          props?.editor?.chain()?.focus().unsetTextAlign().run();
        } else {
          props?.editor?.chain().focus().setTextAlign(alignment).run()!;
        }
      },
      icon: icons[index],
    })
  );

  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => editor?.isActive("bold")!,
      // @ts-ignore
      command: () => editor?.chain().focus().toggleBold().run()!,
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => editor?.isActive("italic")!,
      // @ts-ignore
      command: () => editor?.chain().focus().toggleItalic().run()!,
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => editor?.isActive("underline")!,
      command: () => editor?.chain().focus().toggleUnderline().run()!,
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => editor?.isActive("strike")!,
      // @ts-ignore

      command: () => editor?.chain().focus().toggleStrike().run()!,
      icon: StrikethroughIcon,
    },
    ...alignmentItems,
    {
      name: "code",
      isActive: () => editor?.isActive("code")!,
      // @ts-ignore
      command: () => editor?.chain().focus().toggleCode().run()!,
      icon: CodeIcon,
    },
    {
      name: "link",
      command: () => {
        // @ts-ignore
        const previousUrl = editor?.getAttributes("link").href!;
        const url = window.prompt("URL", previousUrl);

        // If the user cancels the prompt, we don't want to toggle the link
        if (url === null) {
          return;
        }

        // If the user deletes the URL entirely, we'll unlink the selected text
        if (url === "") {
          editor?.chain().focus().extendMarkRange("link").unsetLink().run();

          return;
        }

        // Otherwise, we set the link to the given URL
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run()!;
      },
      isActive: () => editor?.isActive("link")!,
      icon: LinkIcon,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor, state, from, to }) => {
      const { doc, selection } = state;
      const { empty } = selection;

      // Sometime check for `empty` is not enough.
      // Doubleclick an empty paragraph returns a node size of 2.
      // So we check also for an empty text size.
      const isEmptyTextBlock =
        !doc.textBetween(from, to).length && isTextSelection(state.selection);

      if (
        empty ||
        isEmptyTextBlock ||
        !editor.isEditable ||
        editor.isActive("image") ||
        editor.isActive("logo") ||
        editor.isActive("spacer") ||
        editor.isActive("variable") ||
        editor.isActive({
          mailyComponent: "button",
        }) ||
        editor.isActive({
          mailyComponent: "linkCard",
        })
      ) {
        return false;
      }

      return true;
    },
    tippyOptions: {
      maxWidth: "100%",
      moveTransition: "transform 0.15s ease-out",
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      // bg-white
      className="flex gap-1 rounded-md border border-slate-200 bg-red-500  p-1 shadow-md"
    >
      {items.map((item, index) => (
        <BubbleMenuButton key={index} {...item} />
      ))}
    </BubbleMenu>
  );
}
