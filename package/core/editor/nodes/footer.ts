import { mergeAttributes, Node } from "@tiptap/core";

export interface FooterOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    footer: {
      setFooter: () => ReturnType;
    };
  }
}

export const Footer = Node.create<FooterOptions>({
  name: "footer",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      "maily-component": {
        default: "footer",
        renderHTML: (attributes) => {
          return {
            "data-maily-component": attributes["maily-component"],
          };
        },
        parseHTML: (element) => element?.getAttribute("data-maily-component"),
      },
    };
  },

  addCommands() {
    return {
      setFooter:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  parseHTML() {
    return [{ tag: 'small[data-maily-component="footer"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "small",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "footer block text-[13px] text-slate-500",
      }),
      0,
    ];
  },
});
