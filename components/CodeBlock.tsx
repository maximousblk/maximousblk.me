import { useRef, useState } from "react";
import { Copy, Check } from "react-feather";

export function CodeBlock(props): JSX.Element {
  const textInput = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const onEnter = () => {
    setHovered(true);
  };

  const onExit = () => {
    setHovered(false);
    setCopied(false);
  };

  const onCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(textInput.current.textContent);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div ref={textInput} onMouseEnter={onEnter} onMouseLeave={onExit} className="relative">
      {hovered && (
        <button
          onClick={onCopy}
          aria-label="Copy code"
          className="absolute right-3 top-3 items-center px-1.5 py-2 text-left rounded border border-gray-500 dark:border-coolGray-500"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-gray-400" />}
        </button>
      )}
      <pre>{props.children}</pre>
    </div>
  );
}
