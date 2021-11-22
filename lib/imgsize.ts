import sizeOf from "image-size";

interface ImageSize {
  width: number;
  height: number;
  orientation?: number;
  type?: string;
}

export async function getImageSize(imgUrl: string): Promise<ImageSize> {
  const res = await fetch(imgUrl);
  const buffer = await res.arrayBuffer();
  const dimensions = sizeOf(new Buffer(buffer));
  return dimensions;
}
