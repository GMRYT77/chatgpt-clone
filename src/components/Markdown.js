import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MdOutlineContentCopy } from "react-icons/md";
import {
  a11yDark,
  coldarkDark,
  duotoneDark,
  materialDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import CodeBlock from "./CodeBlock";

export default function Markdown({ markdown }) {
  // Override react-markdown elements to add class names
  const P = ({ children }) => <p className="mb-4">{children}</p>;
  const Li = ({ children }) => <li className="mb-2 ml-4">{children}</li>;
  const Strong = ({ children }) => (
    <li className="font-semibold text-gray-50">{children}</li>
  );
  const H1 = ({ children }) => (
    <h1 className="text-[125%] mb-6 font-extrabold">{children}</h1>
  );
  const H2 = ({ children }) => (
    <h2 className="text-[117.5%] mb-5 font-bold">{children}</h2>
  );
  const H3 = ({ children }) => (
    <h3 className="text-[110%] mb-4 font-semibold">{children}</h3>
  );
  const H4 = ({ children }) => (
    <h4 className="text-[105%] font-medium">{children}</h4>
  );
  const Pre = ({ children }) => (
    <pre className="relative w-full overflow-x-auto mb-4">{children}</pre>
  );
  const Ul = ({ children }) => <ul className="mb-6">{children}</ul>;
  const Ol = ({ children }) => <ul className="mb-6">{children}</ul>;
  const Hr = () => <hr className="mb-2" />;

  const mdBody = (
    <ReactMarkdown
      className="leading-7 markdown"
      remarkPlugins={[remarkGfm]} // Allows us to have embedded HTML tags in our markdown
      components={{
        p: P,
        li: Li,
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        hr: Hr,
        ul: Ul,
        ol: Ol,
        pre: Pre,
        strong: Strong,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CodeBlock
              language={match[1]}
              value={String(children).replace(/\n$/, "")}
              props={props}
            />
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
