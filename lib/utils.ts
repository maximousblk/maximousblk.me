import { default as slugy } from "slugify";

export function slugify(text: string[]) {
  return slugy(text.join(""), {
    lower: true,
  });
}
