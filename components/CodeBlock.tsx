import { CodeCopy } from "@/components/CodeCopy";

interface CodeBlockProps {
  title?: string;
  lang?: string;
  plain_text: string;
  children: JSX.Element;
}

export default function CodeBlock({ title, lang, children, plain_text }: CodeBlockProps): JSX.Element {
  return (
    <div className="relative my-6 w-full">
      <div className="flex justify-between overflow-hidden rounded-t-md border border-gray-200 bg-gray-50 align-middle text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        <span className="flex px-2 py-2 font-mono text-sm">
          <span className="select-none uppercase text-gray-400 dark:text-gray-600">{lang}</span>
          <span className="mx-2 line-clamp-1" title={title}>
            {title}
          </span>
        </span>
        {/* <CodeCopy plain_text={plain_text} /> */}
      </div>

      <pre className="my-0 w-full overflow-auto rounded-t-none border border-t-0 border-gray-200 bg-gray-50 p-4 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        {children}
      </pre>
    </div>
  );
}

export { CodeBlock };
