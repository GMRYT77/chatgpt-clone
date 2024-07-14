import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yDark,
  coldarkDark,
  duotoneDark,
  materialDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function Markdown({ markdown }) {
  // Override react-markdown elements to add class names
  const P = ({ children }) => <p className="mb-4">{children}</p>;
  const Li = ({ children }) => <li className="mb-2 ml-4">{children}</li>;
  const Strong = ({ children }) => (
    <li className="font-semibold text-gray-50">{children}</li>
  );
  const H4 = ({ children }) => <h4 className="md-post-h4">{children}</h4>;
  const Pre = ({ children }) => (
    <pre className="relative w-full overflow-x-auto mb-4">{children}</pre>
  );
  const Ul = ({ children }) => <ul className="mb-6 list-disc">{children}</ul>;
  const Ol = ({ children }) => (
    <ul className="mb-6 list-decimal">{children}</ul>
  );
  const Hr = () => <hr className="mb-2" />;

  const mdBody = (
    <ReactMarkdown
      className="leading-7"
      remarkPlugins={[remarkGfm]} // Allows us to have embedded HTML tags in our markdown
      components={{
        p: P,
        li: Li,
        h4: H4,
        hr: Hr,
        ul: Ul,
        ol: Ol,
        pre: Pre,
        strong: Strong,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={a11yDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              className="px-2 py-1 rounded-sm bg-[#2f2f2f] text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );

  return mdBody;
}
