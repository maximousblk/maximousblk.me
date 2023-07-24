"use client";

import { useState } from "react";

import { FiCheck, FiClipboard } from "react-icons/fi";
import useMounted from "@/lib/useMounted";

export function CodeCopy({ plain_text }): JSX.Element {
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(plain_text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <>
      {mounted && (
        <button
          onClick={onCopy}
          aria-label="Copy code"
          title="Copy code"
          className="items-center border-l border-gray-200 p-2 text-left hover:bg-gray-200 dark:border-gray-900 dark:hover:bg-gray-900"
        >
          {copied ? (
            <FiCheck size={14} className="text-emerald-700 dark:text-emerald-400" />
          ) : (
            <FiClipboard size={14} className="text-gray-700 dark:text-gray-400" />
          )}
        </button>
      )}
    </>
  );
}
