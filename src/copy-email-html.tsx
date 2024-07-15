"use client";

import { ClipboardCopy, Loader2 } from "lucide-react";
import { renderAsync } from "../package/render";
import { useState } from "react";

export function SubmitButton(props: any) {
  const handleCopy = () => {
    console.log(props.json);
    renderAsync(props.json).then((html) => {
      console.log(html);
    });
  };

  const handlePreview = () => {
    renderAsync(props.json).then((html) => {
      const newWindow = window.open("about:blank", "_blank");
      newWindow?.focus();

      const newDoc = newWindow?.document;
      if (!newDoc) return;
      newDoc.open();
      newDoc.write(html);
      newDoc.close();
    });
  };
  return (
    <div className="flex gap-4">
      <button
        className="flex min-h-[28px] items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
        onClick={handleCopy}
      >
        <ClipboardCopy className="inline-block shrink-0 sm:mr-1" size={16} />

        <span className="sm:inline-block">Copy HTML</span>
      </button>
      <button
        className="flex min-h-[28px] items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-7"
        onClick={handlePreview}
      >
        <ClipboardCopy className="inline-block shrink-0 sm:mr-1" size={16} />

        <span className="sm:inline-block">Preview Email</span>
      </button>
    </div>
  );
}
