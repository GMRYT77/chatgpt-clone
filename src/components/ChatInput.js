"use client";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import moment from "moment";
import { useSidebarContext } from "./SidebarContext";
import { genAI } from "@/lib/geminiApi";

var randomstring = require("randomstring");

const useChatInput = ({ chatId, geminiModel }) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [output, setOutput] = useState("");
  const textareaRef = useRef(null);
  const { isQuota, setIsQuota } = useSidebarContext();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      const maxHeight = 6 * parseFloat(getComputedStyle(textarea).lineHeight);
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`; // Set new height up to 4 rows
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden"; // Show scrollbar if content exceeds maxHeight
    }
  }, [prompt]);

  //useSWR model

  function randomString() {
    const a = randomstring.generate(20);
    return a;
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    if (isQuota) {
      setPrompt("");
      toast.error("Api limit exceeded, please try again tomorrow.");
      return;
    }

    const input = prompt.trim();
    setPrompt("");

    let mId = randomString();

    const notification = toast.loading("ChatGPT is thinking...");
    setPromptLoading(true);
    try {
      const message = {
        text: input,
        createdAt: serverTimestamp(),
        user: {
          _id: session?.user?.email,
          name: session?.user?.name,
          avatar:
            session?.user?.image ||
            `https://ui-avatars.com/api/?name=${session?.user?.name}`,
        },
      };

      await addDoc(
        collection(
          db,
          "users",
          session?.user?.email,
          "chats",
          chatId,
          "messages"
        ),
        message
      );

      //Toast
      const model = genAI.getGenerativeModel({ model: geminiModel });

      //  queryGemini({ prompt, chatId, session })
      //    .then(async (res) => {
      //      toast.success("ChatGPT has responded!", {
      //        id: notification,
      //      });
      //      await addDoc(
      //        collection(
      //          db,
      //          "users",
      //          session?.user?.email,
      //          "chats",
      //          chatId,
      //          "messages"
      //        ),
      //        {
      //          text: res,
      //          createdAt: serverTimestamp(),
      //          error: false,
      //          user: {
      //            id: "Gemini",
      //          },
      //        }
      //      );
      //    })
      //    .catch(async (err) => {
      //      toast.error("ChatGPT got an error!", {
      //        id: notification,
      //      });
      //      await addDoc(
      //        collection(
      //          db,
      //          "users",
      //          session?.user?.email,
      //          "chats",
      //          chatId,
      //          "messages"
      //        ),
      //        {
      //          text: `${err}`,
      //          createdAt: serverTimestamp(),
      //          error: true,
      //          user: {
      //            id: "Gemini",
      //          },
      //        }
      //      );
      //      console.log(err);
      //    });

      const result = await model.generateContentStream([input]);

      await setDoc(
        doc(
          db,
          "users",
          session?.user?.email,
          "chats",
          chatId,
          "messages",
          mId
        ),
        {
          text: "loading",
          createdAt: serverTimestamp(),
          error: false,
          responded: false,
          model: geminiModel,
          user: {
            id: "Gemini",
          },
        }
      );

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setOutput(chunkText);
        setTimeout(() => {
          console.log(
            chunkText,
            moment(new Date().getTime()).format("hh:mm:ss")
          );
        });
      }

      result.response
        .then(async (res) => {
          toast.success("ChatGPT has responded!", {
            id: notification,
          });

          setPromptLoading(false);

          let msgData = {
            text: res.text(),
            responded: true,
          };

          await updateDoc(
            doc(
              db,
              "users",
              session?.user?.email,
              "chats",
              chatId,
              "messages",
              mId
            ),
            msgData
          );
        })
        .catch(async (err) => {
          toast.error("ChatGPT got an error!", {
            id: notification,
          });

          setPromptLoading(false);

          let msgData = {
            text: err,
            responded: true,
            error: true,
          };

          await updateDoc(
            doc(
              db,
              "users",
              session?.user?.email,
              "chats",
              chatId,
              "messages",
              mId
            ),
            msgData
          );
          console.log(err);
        });
    } catch (error) {
      toast.error("Unexpected Error Occured", {
        id: notification,
      });
      setPromptLoading(false);

      let msgData = {
        text: error.errorDetails
          ? "Error: " + error.errorDetails[0].reason
          : "Sorry, an unexpected error occured. Please try again later.",
        responded: true,
        error: true,
        createdAt: serverTimestamp(),
        model: geminiModel,
        user: {
          id: "Gemini",
        },
      };

      await setDoc(
        doc(
          db,
          "users",
          session?.user?.email,
          "chats",
          chatId,
          "messages",
          mId
        ),
        msgData
      );

      console.log({ ...error });
    }
  };

  return {
    prompt,
    promptOutput: output,
    render: (
      <div className="w-full px-4 flex flex-col items-center sticky z-20 bottom-0 left-0">
        <form className="w-full max-w-screen-md mx-auto relative rounded-[24px] bg-[#2f2f2f] flex items-end gap-2 pl-4 pr-2 py-2">
          <div className="flex-1 flex items-center py-1">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              onKeyDown={(f) => {
                if (f.key === "Enter" && !f.shiftKey) {
                  f.preventDefault();
                  sendMessage(f);
                  return false;
                }
              }}
              rows="1"
              id="CHAT"
              placeholder="Message ChatGPT"
              className="w-full rounded resize-none overflow-hidden bg-transparent outline-none sb"
              style={{ lineHeight: "1.5" }} // Adjust as per your line-height in Tailwind CSS
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!prompt || !session || promptLoading}
            className=" disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-neutral-700 w-8 h-8 rounded-full bg-neutral-300 hover:bg-gray-400 text-neutral-900  flex items-center justify-center text-lg"
          >
            {promptLoading ? (
              <div className="w-3 h-3 rounded-sm bg-neutral-800 animate-pulse"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 32 32"
                className="icon-2xl"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </button>
        </form>
        <div className="text-neutral-400 text-xs relative w-full text-center bg-[#212121] py-2">
          ChatGPT can make mistakes. Check important info.
          <button className="absolute top-1/2 right-0 -translate-y-1/2 text-[1rem] ">
            <BsQuestionCircle />
          </button>
        </div>
      </div>
    ),
  };
};

export default useChatInput;
