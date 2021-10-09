interface block {
  type: string;
  text?: string;
  children?: block[];
}

export const raw: block[] = [
  { type: "heading_1", children: [{ type: "paragraph", text: "heading" }] },
  { type: "paragraph", text: "paragraph 1" },
  { type: "paragraph", text: "paragraph 2" },
  { type: "unordered_list_item", text: "list item 1" },
  { type: "unordered_list_item", text: "list item 2" },
  { type: "unordered_list_item", text: "list item 3" },
  { type: "paragraph", text: "paragraph 3" },
  { type: "paragraph", text: "paragraph 4" },
  { type: "ordered_list_item", text: "list item 4" },
  { type: "ordered_list_item", text: "list item 5" },
  { type: "ordered_list_item", text: "list item 6" },
  { type: "paragraph", text: "paragraph 5" }
];

// so just group the list_items together into lists
// for example:
const grouped = [
  { type: "heading_1", children: [{ type: "paragraph", text: "heading" }] },
  { type: "paragraph", text: "paragraph 1" },
  { type: "paragraph", text: "paragraph 2" },
  {
    type: "unordered_list",
    children: [
      { type: "unordered_list_item", text: "list item 1" },
      { type: "unordered_list_item", text: "list item 2" },
      { type: "unordered_list_item", text: "list item 3" }
    ]
  },
  { type: "paragraph", text: "paragraph 3" },
  { type: "paragraph", text: "paragraph 4" },
  {
    type: "ordered_list",
    children: [
      { type: "ordered_list_item", text: "list item 4" },
      { type: "ordered_list_item", text: "list item 5" },
      { type: "ordered_list_item", text: "list item 6" }
    ]
  },
  { type: "paragraph", text: "paragraph 5" }
];

const final: block[] = raw.reduce((acc: block[], curr: block) => {
  if (curr.type === "bulleted_list_item") {
    if (acc[acc.length - 1].type === "bulleted_list") {
      acc[acc.length - 1].children?.push(curr);
    } else {
      acc.push({ type: "bulleted_list", children: [curr] });
    }
  } else if (curr.type === "numbered_list_item") {
    if (acc[acc.length - 1].type === "numbered_list") {
      acc[acc.length - 1].children?.push(curr);
    } else {
      acc.push({ type: "numbered_list", children: [curr] });
    }
  } else if (curr.type === "to_do") {
    if (acc[acc.length - 1].type === "to_do_list") {
      acc[acc.length - 1].children?.push(curr);
    } else {
      acc.push({ type: "to_do_list", children: [curr] });
    }
  } else if (curr.type === "toggle") {
    if (acc[acc.length - 1].type === "toggle_list") {
      acc[acc.length - 1].children?.push(curr);
    } else {
      acc.push({ type: "toggle_list", children: [curr] });
    }
  } else {
    acc.push(curr);
  }
  return acc;
}, []);

console.log(final, grouped, final === grouped);
