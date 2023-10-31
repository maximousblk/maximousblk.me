"use client";

import { FiPlay } from "react-icons/fi";
import ReactPlayer from "react-player";

export function NotionVideo({ url, caption }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-900 dark:bg-gray-800">
        <ReactPlayer
          light
          controls
          url={url}
          playIcon={<FiPlay size="64" />}
          className="aspect-video !h-auto max-h-max !w-full max-w-full"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default NotionVideo;
