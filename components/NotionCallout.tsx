import ClientImage from "@/components/ClientImage";
import Emoji from "@/components/Emoji";
import { getNotionColorClass } from "@/lib/utils";

export default function NotionCallout({ contents, children, color, icon, ...props }) {
  return (
    <div
      className={
        "my-6 flex space-x-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-900 dark:bg-gray-950 " +
        getNotionColorClass(color)
      }
      {...props}
    >
      <div className="mt-0.5 h-6 w-6 select-none overflow-hidden rounded" aria-hidden="true">
        {icon.type == "emoji" ? (
          <Emoji emoji={icon.emoji} size={24} />
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
