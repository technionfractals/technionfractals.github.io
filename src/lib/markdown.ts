import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const processor = createMarkdownProcessor({
  syntaxHighlight: false,
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
});

export const renderMarkdown = async (content: string) =>
  (await (await processor).render(content)).code;

export const renderInlineMarkdown = async (content: string) =>
  (await renderMarkdown(content)).replace(/^<p>/, "").replace(/<\/p>\s*$/, "");
