import sizeOf from "image-size";

export async function getImageSize(imgUrl: string): Promise<{ width: number; height: number; orientation?: number; type?: string }> {
  const res = await fetch(imgUrl);
  const buffer = await res.arrayBuffer();
  const dimensions = sizeOf(new Buffer(buffer));
  return dimensions;
}
