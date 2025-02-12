import sanitizeHtml from "sanitize-html";

export function sanitize(input: string) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}