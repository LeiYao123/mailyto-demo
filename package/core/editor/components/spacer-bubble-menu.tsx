/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { BubbleMenu } from "@tiptap/react";

import { BubbleMenuButton } from "./bubble-menu-button";
import { BubbleMenuItem, EditorBubbleMenuProps } from "./editor-bubble-menu";
import { allowedSpacerSize } from "../nodes/spacer";
import React from "react";

export function SpacerBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const items: BubbleMenuItem[] = allowedSpacerSize.map((height) => ({
    name: height,
    isActive: () => editor?.isActive("spacer", { height })!,
    command: () => {
      editor?.chain().focus().setSpacer({ height }).run();
    },
  }));

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => editor.isActive("spacer"),
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
      {items.map((item, index) => (
        <BubbleMenuButton key={index} {...item} />
      ))}
    </BubbleMenu>
  );
}
