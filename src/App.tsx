"use client";

import { useState } from "react";
import { Editor } from "../package/core";
import { Loader2 } from "lucide-react";
import type { Editor as TiptapEditor, JSONContent } from "@tiptap/core";
import { cn } from "./utils/classname";
import { SubmitButton } from "./copy-email-html";

export default function EditorPreview() {
  const defaultContent = {
    type: "doc",
    content: [
      {
        type: "logo",
        attrs: {
          src: "https://maily.to/brand/logo.png",
          alt: null,
          title: null,
          "maily-component": "logo",
          size: "md",
          alignment: "left",
        },
      },
      { type: "spacer", attrs: { height: "xl" } },
      {
        type: "heading",
        attrs: { textAlign: "left", level: 2 },
        content: [
          { type: "text", marks: [{ type: "bold" }], text: "Discover Maily" },
        ],
      },
      {
        type: "paragraph",
        attrs: { textAlign: "left" },
        content: [
          {
            type: "text",
            text: "Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: { textAlign: "left" },
        content: [
          {
            type: "text",
            text: "Elevate your email communication with Maily! Click below to try it out:",
          },
        ],
      },
      {
        type: "button",
        attrs: {
          mailyComponent: "button",
          text: "Try Maily Now →",
          url: "",
          alignment: "left",
          variant: "filled",
          borderRadius: "round",
          buttonColor: "#141313",
          textColor: "#ffffff",
        },
      },
      { type: "spacer", attrs: { height: "xl" } },
      {
        type: "paragraph",
        attrs: { textAlign: "left" },
        content: [
          {
            type: "text",
            text: "Join our vibrant community of users and developers on GitHub, where Maily is an ",
          },
          {
            type: "text",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "https://github.com/arikchakma/maily.to",
                  target: "_blank",
                  rel: "noopener noreferrer nofollow",
                  class: null,
                },
              },
              { type: "italic" },
            ],
            text: "open-source",
          },
          {
            type: "text",
            text: " project. Together, we'll shape the future of email editing.",
          },
        ],
      },
      {
        type: "paragraph",
        attrs: { textAlign: "left" },
        content: [
          { type: "text", text: "Regards," },
          { type: "hardBreak" },
          { type: "text", text: "Arikko" },
        ],
      },
    ],
  };

  const [editor, setEditor] = useState<TiptapEditor | null>(null);
  const [json, setJson] = useState<JSONContent | null>(null);

  const defaultHtml = `<img src="https://maily.to/brand/logo.png" data-maily-component="logo" data-size="md" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h2><strong>Discover Maily</strong></h2><p>Are you ready to transform your email communication? Introducing Maily, the powerful email editor that enables you to craft captivating emails effortlessly.</p><p>Elevate your email communication with Maily! Click below to try it out:</p><a data-maily-component="button" mailycomponent="button" text="Try Maily Now →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><div data-maily-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><p>Join our vibrant community of users and developers on GitHub, where Maily is an <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/arikchakma/maily.to"><em>open-source</em></a> project. Together, we'll shape the future of email editing.</p><p>Regards,<br>Arikko</p>`;
  console.log(JSON.stringify(json));
  return (
    <div className={cn("mt-8 mx-auto w-full max-w-[800px] p-5")}>
      <SubmitButton json={json} />

      <div>
        {!editor ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : null}
        <hr className="my-10" />
        <Editor
          config={{
            hasMenuBar: false,
            wrapClassName: "editor-wrap",
            bodyClassName: "!mt-0 !border-0 !p-0",
            contentClassName: "editor-content",
            toolbarClassName: "flex-wrap !items-start",
            spellCheck: false,
            autofocus: false,

            // ...defaultConfig,
          }}
          // contentHtml={defaultHtml}
          contentJson={defaultContent}
          onCreate={(e) => {
            setEditor(e as unknown as TiptapEditor);
            // console.log(e?.getJSON());
            setJson(e?.getJSON() || {});
          }}
          onUpdate={(e) => {
            setEditor(e as unknown as TiptapEditor);
            setJson(e?.getJSON() || {});
          }}
          variables={[{ name: "aa" }, { name: "bb" }]}
        />
      </div>
    </div>
  );
}
