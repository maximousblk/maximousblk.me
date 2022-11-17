"use client";

import { useRef, useState } from "react";
import { FiClipboard, FiCheck } from "react-icons/fi";

interface CodeBlockProps {
  title?: string;
  lang?: string;
  children: React.ReactChild;
}

export default function CodeBlock({ title, lang, children }: CodeBlockProps): JSX.Element {
  const textInput = useRef(null);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(textInput.current.textContent);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div ref={textInput} className="relative my-6 w-full">
      <div className="flex justify-between overflow-hidden rounded-t-md border border-gray-200 bg-gray-50 align-middle text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        <span className="flex px-2 py-2 font-mono text-sm">
          <span className="select-none uppercase text-gray-400 dark:text-gray-600">{lang}</span>
          <span className="mx-2 line-clamp-1" title={title}>
            {title}
          </span>
        </span>
        <button
          onClick={onCopy}
          aria-label="Copy code"
          title="Copy code"
          className="items-center border-l border-gray-200 p-2 text-left hover:bg-gray-200 dark:border-gray-800 dark:hover:bg-gray-800"
        >
          {copied ? (
            <FiCheck size={14} className="text-emerald-700 dark:text-emerald-400" />
          ) : (
            <FiClipboard size={14} className="text-gray-700 dark:text-gray-400" />
          )}
        </button>
      </div>

      <pre className="my-0 w-full overflow-auto rounded-t-none border border-t-0 border-gray-200 bg-gray-50 p-4 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        {children}
      </pre>
    </div>
  );
}

export { CodeBlock };
