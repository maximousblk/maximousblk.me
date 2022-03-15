import { useRef, useState } from "react";
import { Clipboard, Check } from "react-feather";

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
    <div ref={textInput} className="relative w-full my-6">
      <div className="flex justify-between align-middle px-4 py-2 rounded-t-md border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
        <span className="flex font-mono">
          <span className="uppercase font-medium text-gray-400 dark:text-gray-600 select-none">{lang}</span>
          <span className="mx-4 line-clamp-1" title={title}>
            {title}
          </span>
        </span>
        <button
          onClick={onCopy}
          aria-label="Copy code"
          title="Copy code"
          className="items-center px-1 py-1.5 text-left rounded bg-opacity-40 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {copied ? (
            <Check size={14} className="text-emerald-700 dark:text-emerald-400" />
          ) : (
            <Clipboard size={14} className="text-gray-700 dark:text-gray-400" />
          )}
        </button>
      </div>

      <pre className="p-4 my-0 w-full overflow-auto rounded-t-none border border-t-0 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
        {children}
      </pre>
    </div>
  );
}

export { CodeBlock };
