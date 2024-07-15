"use client";
import React from "react";

import { Editor as TiptapEditor, Extension, FocusPosition } from "@tiptap/core";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";

// import { EditorBubbleMenu } from "./components/editor-bubble-menu";
import { EditorBubbleMenu } from "./components/editor-bubble-menu";
import { EditorMenuBar } from "./components/editor-menu-bar";
import { ImageBubbleMenu } from "./components/image-bubble-menu";
import { SpacerBubbleMenu } from "./components/spacer-bubble-menu";
import { extensions as defaultExtensions } from "./extensions";
import { MailyContextType, MailyProvider } from "./provider";
import { cn } from "./utils/classname";

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent;
  onUpdate?: (editor?: TiptapEditor) => void;
  onCreate?: (editor?: TiptapEditor) => void;
  extensions?: Extension[];
  config?: {
    hasMenuBar?: boolean;
    spellCheck?: boolean;
    wrapClassName?: string;
    toolbarClassName?: string;
    contentClassName?: string;
    bodyClassName?: string;
    autofocus?: FocusPosition;
  };
} & Partial<MailyContextType>;

export function Editor(props: EditorProps) {
  const {
    config: {
      wrapClassName = "",
      contentClassName = "",
      bodyClassName = "",
      hasMenuBar = true,
      spellCheck = false,
      autofocus = "end",
    } = {},
    onCreate,
    onUpdate,
    extensions,
    contentHtml,
    contentJson,
    variables,
    slashCommands,
  } = props;

  let formattedContent: any = null;
  if (contentJson) {
    formattedContent =
      contentJson?.type === "doc"
        ? contentJson
        : {
            type: "doc",
            content: contentJson,
          };
  } else if (contentHtml) {
    formattedContent = contentHtml;
  } else {
    formattedContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    };
  }

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(`prose w-full`, contentClassName),
        spellCheck: spellCheck ? "true" : "false",
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
            const slashCommand = document.querySelector("#slash-command");
            if (slashCommand) {
              return true;
            }
          }
        },
      },
    },
    onCreate: ({ editor }) => {
      onCreate?.(editor);
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor);
    },
    extensions: [
      ...defaultExtensions({
        variables,
        slashCommands,
      }),
      ...(extensions || []),
    ],
    content: formattedContent,
    autofocus,
  });

  if (!editor) {
    return null;
  }

  return (
    <MailyProvider variables={variables}>
      <div className={cn("editor antialiased", wrapClassName)}>
        {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
        <div className={cn("mt-4 rounded border bg-white p-4", bodyClassName)}>
          <EditorBubbleMenu editor={editor} />
          <ImageBubbleMenu editor={editor} />
          <SpacerBubbleMenu editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </MailyProvider>
  );
}
