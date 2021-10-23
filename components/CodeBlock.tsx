import { useRef, useState } from "react";
import { Clipboard, Check } from "react-feather";

export function CodeBlock(props): JSX.Element {
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
    <div ref={textInput} onMouseEnter={showCopy} onMouseLeave={hideCopy} className="relative">
      {hovered && (
        <button
          onClick={onCopy}
          aria-label="Copy code"
          className="absolute top-4 right-4 items-center px-1 py-1.5 text-left rounded border border-gray-500 dark:border-coolGray-500 hover:border-gray-700 dark:hover:border-coolGray-400"
        >
          {copied ? (
            <Check size={14} className="text-emerald-700 dark:text-emerald-400" />
          ) : (
            <Clipboard size={14} className="text-gray-700 dark:text-coolGray-400" />
          )}
        </button>
      )}
      <pre>{props.children}</pre>
    </div>
  );
}
