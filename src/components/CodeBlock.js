"use client";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { MdOutlineContentCopy } from "react-icons/md";

const CodeBlock = ({ language, value, props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    console.log(language);
  };

  return (
    <div className="w-full relative mt-4 bg-[#363636] rounded">
      <div className="w-full flex justify-between px-4 pt-1 items-center h-10 -mb-1">
        <span className="font-mono text-xs ">{language}</span>
        <CopyToClipboard text={value} onCopy={handleCopy}>
          {!copied ? (
            <button className="flex items-center gap-1 text-[.8rem] py-0.5 px-2 hover:bg-[#4a4a4a]/80 transition rounded">
              <MdOutlineContentCopy className="text-[115%]" />
              Copy Code
            </button>
          ) : (
            <div className="px-2 py-0.5 rounded text-[.8rem]">Copied!</div>
          )}
        </CopyToClipboard>
      </div>

      <SyntaxHighlighter
        style={a11yDark}
        language={language}
        PreTag="div"
        {...props}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
