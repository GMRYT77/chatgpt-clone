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
import { FaArrowUp } from "react-icons/fa";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { queryGemini } from "@/lib/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import moment from "moment";
var randomstring = require("randomstring");

const useChatInput = ({ chatId }) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [msgId, setMsgId] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      const maxHeight = 4 * parseFloat(getComputedStyle(textarea).lineHeight);
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

    const input = prompt.trim();
    setPrompt("");

    let mId = randomString();

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
    const notification = toast.loading("ChatGPT is thinking...");

    const genAI = new GoogleGenerativeAI(
      "AIzaSyD6zQ0Ag9OJVeI5gd27JkwJeuMNHDiD7qw"
    );
    // Choose a model that's appropriate for your use case.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContentStream([prompt]);

    await setDoc(
      doc(db, "users", session?.user?.email, "chats", chatId, "messages", mId),
      {
        text: "loading",
        createdAt: serverTimestamp(),
        error: false,
        responded: false,
        user: {
          id: "Gemini",
        },
      }
    );

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      setOutput(chunkText);
      setTimeout(() => {
        console.log(chunkText, moment(new Date().getTime()).format("hh:mm:ss"));
      });
    }

    result.response
      .then(async (res) => {
        toast.success("ChatGPT has responded!", {
          id: notification,
        });

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
  };

  return {
    prompt,
    promptOutput: output,
    render: (
      <div className="w-full px-4 flex flex-col items-center ">
        <form
          onSubmit={sendMessage}
          className="w-full max-w-screen-md mx-auto relative rounded-[24px] bg-[#2f2f2f] flex items-end gap-2 pl-4 pr-2 py-2"
        >
          <div className="flex-1 flex items-center py-1">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                e.target.addEventListener("keypress", (f) => {
                  if (f.key === "Enter" && !f.shiftKey) {
                    f.preventDefault();
                    return;
                  }
                });
              }}
              rows="1"
              id="CHAT"
              placeholder="Message ChatGPT"
              className="w-full rounded resize-none overflow-hidden bg-transparent outline-none"
              style={{ lineHeight: "1.5" }} // Adjust as per your line-height in Tailwind CSS
            />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="hidden"
            />
          </div>
          <button
            type="submit"
            disabled={!prompt || !session}
            className=" disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-neutral-700 w-8 h-8 rounded-full bg-neutral-300 hover:bg-gray-400 text-neutral-900  flex items-center justify-center text-lg"
          >
            <FaArrowUp />
          </button>
        </form>
        <div className="text-neutral-400 text-xs relative w-full text-center bg-[#212121] pt-2">
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
