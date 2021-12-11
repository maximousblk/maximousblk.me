import { useRef, useState } from "react";
import { Clipboard, Check } from "react-feather";

export default function CodeBlock(props): JSX.Element {
  const textInput = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const showCopy = () => {
    setHovered(true);
  };

  const hideCopy = () => {
    setHovered(false);
    setCopied(false);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(textInput.current.textContent);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div ref={textInput} onMouseEnter={showCopy} onMouseLeave={hideCopy} className="relative w-full my-6">
      {hovered && (
        <button
          onClick={onCopy}
          aria-label="Copy code"
          className="absolute top-4 right-4 items-center px-1 py-1.5 text-left rounded bg-opacity-40 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {copied ? (
            <Check size={14} className="text-emerald-700 dark:text-emerald-400" />
          ) : (
            <Clipboard size={14} className="text-gray-700 dark:text-gray-400" />
          )}
        </button>
      )}
      <pre className="p-4 w-full overflow-auto border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">{props.children}</pre>
    </div>
  );
}

export { CodeBlock };
