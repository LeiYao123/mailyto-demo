import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import React from "react";

import { NodeViewProps, NodeViewWrapper, ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { GetReferenceClientRect } from "tippy.js";
import { AlertTriangle, Braces } from "lucide-react";
import { cn } from "../utils/classname";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Input } from "../components/input";
import { useMailyContext, Variables } from "../provider";

export const VariableList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length
        );
        return true;
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="z-50 h-auto min-w-[128px] rounded-md border border-gray-200 bg-white p-1 shadow-md transition-all">
      {props?.items?.length ? (
        props?.items?.map((item: string, index: number) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={cn(
              "flex w-full space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100",
              index === selectedIndex ? "bg-gray-200" : "bg-white"
            )}
          >
            {item}
          </button>
        ))
      ) : (
        <button className="flex w-full space-x-2 rounded-md bg-white px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100">
          No result
        </button>
      )}
    </div>
  );
});

VariableList.displayName = "VariableList";

export function getVariableSuggestions(
  variables: Variables = []
): Omit<SuggestionOptions, "editor"> {
  const defaultVariables = variables.map((variable) => variable.name);

  return {
    items: ({ query }) => {
      return defaultVariables
        .concat(query.length > 0 ? [query] : [])
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
    },

    render: () => {
      let component: ReactRenderer<any>;
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(VariableList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup?.[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          if (!popup || !popup?.[0] || !component) {
            return;
          }

          popup?.[0].destroy();
          component.destroy();
        },
      };
    },
  };
}

export function VariableComponent(props: NodeViewProps) {
  const { node, selected, updateAttributes } = props;
  const { id, fallback } = node.attrs;

  const { variables = [] } = useMailyContext();
  const isRequired =
    variables.find((variable) => variable.name === id)?.required ?? true;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <NodeViewWrapper
      className={cn(
        "react-component",
        selected && "ProseMirror-selectednode",
        "inline-block leading-none"
      )}
      draggable="false"
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <span tabIndex={-1} style={{ backgroundColor: "green" }}>
            {id}
          </span>
          {/* <span
            tabIndex={-1}
            className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 leading-none text-rose-800"
          >
            {id}
            {isRequired && !fallback && (
              <AlertTriangle className="h-3 w-3 shrink-0 stroke-[2.5]" />
            )}
          </span> */}
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="space-y-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <label className="block w-full space-y-1.5 leading-none">
            <span className="text-xs font-normal leading-none">
              Variable Name
            </span>
            <Input
              placeholder="Add Variable Name"
              value={id}
              onChange={(e) => {
                updateAttributes({
                  id: e.target.value,
                });
              }}
            />
          </label>
          <label className="block w-full space-y-1.5 leading-none">
            <span className="text-xs font-normal leading-none">
              Fallback Value
            </span>
            <Input
              placeholder="Fallback Value"
              value={fallback || ""}
              onChange={(e) => {
                updateAttributes({
                  fallback: e.target.value,
                });
              }}
            />

            <p className="text-xs text-gray-500">
              If the variable doesn't exist, this fallback value will be used.
            </p>
          </label>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
