import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { BaseButton } from "../components/base-button";
import { Input } from "../components/input";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Textarea } from "../components/textarea";
import { cn } from "../utils/classname";
import React from "react";

export function LinkCardComponent(props: NodeViewProps) {
  const {
    layout,
    title,
    description,
    link,
    linkTitle,
    image,
    badgeText,
    subTitle,
  } = props.node.attrs;
  const { getPos, editor } = props;

  return (
    <NodeViewWrapper
      className={`react-component ${
        props.selected && "ProseMirror-selectednode"
      }`}
      draggable="true"
      data-drag-handle=""
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <div
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              const pos = getPos();
              editor.commands.setNodeSelection(pos);
            }}
          >
            <div className="no-prose flex flex-col rounded-lg border border-gray-300">
              {image && (
                <div className="relative aspect-[16/9] w-full shrink-0 mb-1.5">
                  <img
                    src={image}
                    alt="link-card"
                    className="no-prose absolute inset-0 !mb-0 h-full w-full rounded-t-lg object-cover"
                  />
                </div>
              )}
              <div className="flex items-stretch p-3">
                <div className={cn("flex flex-col")}>
                  <div className="!mb-1.5 flex items-center gap-1.5">
                    <h2 className="!mb-0 !text-lg font-semibold">{title}</h2>
                    {badgeText && (
                      <span className="!font-base text-xs rounded-md bg-yellow-200 px-2 py-1 font-semibold leading-none">
                        {badgeText}
                      </span>
                    )}{" "}
                    {subTitle && !badgeText && (
                      <span className="!font-base text-xs rounded-md font-regular leading-none text-gray-400">
                        {subTitle}
                      </span>
                    )}
                  </div>
                  <p className="!my-0 !text-base text-gray-500">
                    {description}{" "}
                    {linkTitle ? (
                      <a href={link} className="font-semibold">
                        {linkTitle}
                      </a>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="flex w-96 flex-col gap-2"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <label className="w-full space-y-1">
            <span className="text-xs font-normal text-slate-400">Image</span>
            <Input
              placeholder="Add Image"
              type="url"
              value={image}
              onChange={(e) => {
                props.updateAttributes({
                  image: e.target.value,
                });
              }}
            />
          </label>

          <label className="w-full space-y-1">
            <span className="text-xs font-normal text-slate-400">Title</span>
            <Input
              placeholder="Add title"
              value={title}
              onChange={(e) => {
                props.updateAttributes({
                  title: e.target.value,
                });
              }}
            />
          </label>

          <label className="w-full space-y-1">
            <span className="text-xs font-normal text-slate-400">
              Description
            </span>
            <Textarea
              placeholder="Add description here"
              value={description}
              onChange={(e) => {
                props.updateAttributes({
                  description: e.target.value,
                });
              }}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="w-full space-y-1">
              <span className="text-xs font-normal text-slate-400">
                Link Title
              </span>
              <Input
                placeholder="Add link title here"
                value={linkTitle}
                onChange={(e) => {
                  props.updateAttributes({
                    linkTitle: e.target.value,
                  });
                }}
              />
            </label>

            <label className="w-full space-y-1">
              <span className="text-xs font-normal text-slate-400">Link</span>
              <Input
                placeholder="Add link here"
                value={link}
                onChange={(e) => {
                  props.updateAttributes({
                    link: e.target.value,
                  });
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="w-full space-y-1">
              <span className="text-xs font-normal text-slate-400">
                Badge Text
              </span>
              <Input
                placeholder="Add badge text here"
                value={badgeText}
                onChange={(e) => {
                  props.updateAttributes({
                    badgeText: e.target.value,
                  });
                }}
              />
            </label>

            <label className="w-full space-y-1">
              <span className="text-xs font-normal text-slate-400">
                Sub Title
              </span>
              <Input
                placeholder="Add sub title here"
                value={subTitle}
                onChange={(e) => {
                  props.updateAttributes({
                    subTitle: e.target.value,
                  });
                }}
              />
            </label>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
