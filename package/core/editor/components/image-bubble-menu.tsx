/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { BubbleMenu } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowUpRight,
  Link,
  Unlink,
} from "lucide-react";
import React from "react";

import { BubbleMenuButton } from "./bubble-menu-button";
import { BubbleMenuItem, EditorBubbleMenuProps } from "./editor-bubble-menu";
import { allowedLogoAlignment, allowedLogoSize } from "../nodes/logo";

export function ImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const icons = [AlignLeftIcon, AlignCenterIcon, AlignRightIcon];

  const alignmentItems: BubbleMenuItem[] = allowedLogoAlignment.map(
    (alignment, index) => ({
      name: alignment,
      isActive: () =>
        editor?.isActive("logo", { alignment })! ||
        editor?.isActive("image", { alignment })!,
      shouldShow: () => editor?.isActive("logo")! || editor?.isActive("image")!,
      command: () => {
        const isCurrentNodeLogo = editor?.isActive("logo")!;
        if (isCurrentNodeLogo) {
          props?.editor?.chain().focus().setLogoAttributes({ alignment }).run();
        } else {
          props?.editor
            ?.chain()
            .focus()
            .updateAttributes("image", { alignment })
            .run();
        }
      },
      icon: icons[index],
    })
  );

  const sizeItems: BubbleMenuItem[] = allowedLogoSize.map((size) => ({
    name: size,
    isActive: () => props?.editor?.isActive("logo", { size })!,
    shouldShow: () => editor?.isActive("logo")!,
    command: () => {
      props?.editor?.chain().focus().setLogoAttributes({ size }).run();
    },
  }));

  const items: BubbleMenuItem[] = [
    ...alignmentItems,
    {
      name: "url",
      isActive: () => false,
      shouldShow: () => editor?.isActive("logo")!,
      command: () => {
        const { editor } = props;
        const currentUrl = editor?.getAttributes("logo")?.src;
        const url = window.prompt("Update logo URL", currentUrl);
        if (!url) {
          return;
        }

        const size = editor?.getAttributes("logo")?.size;
        const alignment = editor?.getAttributes("logo")?.alignment;

        // Remove the current logo
        // and insert a new one
        const selection = editor?.state.selection;
        editor?.commands.setLogoImage({
          src: url,
          size: size,
          alignment: alignment,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Link,
    },
    {
      name: "image-url",
      isActive: () => false,
      shouldShow: () => editor?.isActive("image")!,
      command: () => {
        const { editor } = props;
        const currentUrl = editor?.getAttributes("image")?.src;
        const url = window.prompt("Update Image URL", currentUrl);
        if (!url) {
          return;
        }

        // Remove the current logo
        // and insert a new one
        const selection = editor?.state.selection;
        editor?.commands.setImage({
          src: url,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Unlink,
    },
    {
      name: "image-external-url",
      isActive: () => false,
      shouldShow: () => editor?.isActive("image")!,
      command: () => {
        const { editor } = props;
        // const currentUrl = editor?.getAttributes('image')?.ex
        const externalLink = editor?.getAttributes("image")?.externalLink;

        const url = window.prompt(
          "Update Image External URL",
          externalLink || ""
        );

        editor?.commands.updateAttributes("image", { externalLink: url || "" });
      },
      icon: ArrowUpRight,
    },

    ...sizeItems,
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      return editor.isActive("logo") || editor.isActive("image");
    },
    tippyOptions: {
      maxWidth: "100%",
      moveTransition: "transform 0.15s ease-out",
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-md"
    >
      {items
        .filter((item) => item.shouldShow?.())
        .map((item, index) => {
          return <BubbleMenuButton key={index} {...item} />;
        })}
    </BubbleMenu>
  );
}
