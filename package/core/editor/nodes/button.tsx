import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import React from "react";

import { useEffect, useState } from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

import { BaseButton } from "../components/base-button";
import { ColorPicker } from "../components/color-picker";
import { Input } from "../components/input";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import {
  allowedButtonBorderRadius,
  AllowedButtonVariant,
  allowedButtonVariant,
} from "../extensions/button-extension";
import { cn } from "../utils/classname";

const alignments = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
};

const items = {
  style(props: NodeViewProps) {
    return allowedButtonVariant.map((variant) => ({
      name: variant,
      isActive: props.node.attrs.variant === variant,
      onClick: () => {
        props.updateAttributes({
          variant: variant,
        });
      },
    }));
  },
  cornerRadius(props: NodeViewProps) {
    return allowedButtonBorderRadius.map((radius) => ({
      name: radius,
      isActive: props.node.attrs.borderRadius === radius,
      onClick: () => {
        props.updateAttributes({
          borderRadius: radius,
        });
      },
    }));
  },
  alignment(props: NodeViewProps) {
    return Object.entries(alignments).map(([alignment, Icon]) => ({
      name: alignment,
      icon: Icon,
      isActive: props.node.attrs.alignment === alignment,
      onClick: () => props.updateAttributes({ alignment }),
    }));
  },
};

export function ButtonComponent(props: NodeViewProps) {
  const {
    url,
    text,
    alignment,
    variant,
    borderRadius: _radius,
    buttonColor,
    textColor,
  } = props.node.attrs;
  const { getPos, editor } = props;

  return (
    <NodeViewWrapper
      className={`react-component ${
        props.selected && "ProseMirror-selectednode"
      }`}
      draggable="true"
      data-drag-handle=""
      style={{
        textAlign: alignment,
      }}
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <div>
            <button
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors disabled:pointer-events-none disabled:opacity-50",
                "h-10 px-4 py-2",
                "px-[32px] py-[20px] font-semibold no-underline",
                {
                  "!rounded-full": _radius === "round",
                  "!rounded-md": _radius === "smooth",
                  "!rounded-none": _radius === "sharp",
                }
              )}
              tabIndex={-1}
              style={{
                backgroundColor:
                  variant === "filled" ? buttonColor : "transparent",
                color: textColor,
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: buttonColor,
              }}
              onClick={(e) => {
                e.preventDefault();
                const pos = getPos();
                editor.commands.setNodeSelection(pos);
              }}
            >
              {text}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="space-y-2"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Input
            placeholder="Add text here"
            value={text}
            onChange={(e) => {
              props.updateAttributes({
                text: e.target.value,
              });
            }}
          />
          <Input
            placeholder="Add link here"
            value={url}
            onChange={(e) => {
              props.updateAttributes({
                url: e.target.value,
              });
            }}
          />

          <div className="w-full space-y-2">
            <p className="text-xs font-normal text-slate-400">Style</p>
            <div className="flex gap-1">
              {items.style(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? "true" : "false"}
                  variant="ghost"
                  className="grow font-normal capitalize"
                  size="sm"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.name}
                </BaseButton>
              ))}
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-xs font-normal text-slate-400">Corner Radius</p>
            <div className="flex gap-1">
              {items.cornerRadius(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? "true" : "false"}
                  variant="ghost"
                  className="grow font-normal capitalize"
                  size="sm"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.name}
                </BaseButton>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <p className="text-xs font-normal text-slate-400">Alignment</p>
              <div className="mt-2 flex gap-1">
                {items.alignment(props).map((item, index) => (
                  <BaseButton
                    key={index}
                    data-state={item.isActive ? "true" : "false"}
                    variant="ghost"
                    className="grow"
                    size="sm"
                    onClick={item.onClick}
                    type="button"
                  >
                    <item.icon size={16} />
                  </BaseButton>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-normal text-slate-400">Color</p>
              <div className="mt-2 flex gap-1">
                <BackgroundColorPickerPopup
                  variant={variant}
                  color={buttonColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      buttonColor: color,
                    });
                  }}
                />
                <TextColorPickerPopup
                  color={textColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      textColor: color,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}

type ColorPickerProps = {
  variant?: AllowedButtonVariant;
  color: string;
  onChange: (color: string) => void;
};

function BackgroundColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange, variant } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <BaseButton variant="ghost" className="" size="sm" type="button">
          <div
            className="h-4 w-4 rounded"
            style={{
              backgroundColor: variant === "filled" ? color : "transparent",
              borderStyle: "solid",
              borderWidth: variant === "outline" ? 2 : 0,
              borderColor: color,
            }}
          />
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-none border-0 !bg-transparent !p-0 shadow-none drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(newColor) => {
            // HACK: This is a workaround for a bug in tiptap
            // https://github.com/ueberdosis/tiptap/issues/3580
            //
            //     ERROR: flushSync was called from inside a lifecycle
            //
            // To fix this, we need to make sure that the onChange
            // callback is run after the current execution context.
            queueMicrotask(() => {
              onChange(newColor);
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function TextColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <BaseButton variant="ghost" size="sm" type="button">
          <div className="flex flex-col items-center justify-center gap-[1px]">
            <span className="font-bolder font-mono text-xs text-slate-700">
              A
            </span>
            <div className="h-[2px] w-3" style={{ backgroundColor: color }} />
          </div>
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-none border-0 !bg-transparent !p-0 shadow-none drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(color) => {
            queueMicrotask(() => {
              onChange(color);
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
