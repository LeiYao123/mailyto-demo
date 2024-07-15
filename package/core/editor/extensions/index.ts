import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";

import { HorizontalRule } from "./horizontal-rule";
import { ButtonExtension } from "./button-extension";
import { Footer } from "../nodes/footer";
import { TiptapLogoExtension } from "../nodes/logo";
import { Spacer } from "../nodes/spacer";
import { getVariableSuggestions } from "../nodes/variable";
import { getSlashCommandSuggestions, SlashCommand } from "./slash-command";
import { Variable } from "./variable-extension";
import { ResizableImageExtension } from "./image-resize";
import { MailyContextType } from "../provider";
import { LinkCardExtension } from "./link-card";

type ExtensionsProps = Partial<MailyContextType>;

export function extensions(props: ExtensionsProps) {
  const { variables, slashCommands } = props;

  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      dropcursor: {
        color: "#555",
        width: 3,
      },
      code: {
        HTMLAttributes: {
          class:
            "px-1 py-0.5 bg-[#efefef] text-sm rounded-md tracking-normal font-normal",
        },
      },
      horizontalRule: false,
      blockquote: {
        HTMLAttributes: {
          class: "not-prose border-l-4 border-gray-300 pl-4 mt-4 mb-4",
        },
      },
    }),
    Underline,
    TiptapLogoExtension,
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure(),
    TextAlign.configure({ types: [Paragraph.name, Heading.name, Footer.name] }),
    HorizontalRule,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") {
          return `Heading ${node.attrs.level}`;
        }

        return "Write something or / to see commands";
      },
      includeChildren: true,
    }),
    Spacer,
    Footer,
    Variable.configure({
      suggestion: getVariableSuggestions(variables),
    }),
    SlashCommand.configure({
      suggestion: getSlashCommandSuggestions(slashCommands),
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      },
      openOnClick: false,
    }),
    ButtonExtension,
    ResizableImageExtension,
    LinkCardExtension,
  ];
}
