import { Fragment } from "react";

// Only the supplied Markdown subset: bold and HTTPS links. Never interpret HTML.
export function BlogInlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^)\s]+\))/g);
  return <>{parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/);
    return link
      ? <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 break-words">{link[1]}</a>
      : <Fragment key={i}>{part}</Fragment>;
  })}</>;
}
