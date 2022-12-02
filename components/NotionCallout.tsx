import ClientImage from "@/components/ClientImage";
import Twemoji from "@/components/Twemoji";
import { getNotionColorClass } from "@/lib/utils";

export default function NotionCallout({ contents, children, color, icon, ...props }) {
  return (
    <div
      className={
        "my-6 flex space-x-3 rounded border px-3 py-2 border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 " +
        getNotionColorClass(color)
      }
      {...props}
    >
      <div className="mt-0.5 h-6 w-6 select-none overflow-hidden rounded" aria-hidden="true">
        {icon.type == "emoji" ? (
          <Twemoji emoji={icon.emoji} size={24} />
        ) : (
          <ClientImage alt="icon" src={icon[icon.type].url} height={24} width={24} />
        )}
      </div>

      <div className="w-full space-y-4">
        {contents}
        {children}
      </div>
    </div>
  );
}
