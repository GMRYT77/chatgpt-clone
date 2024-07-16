"use client";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Chat from "@/components/Chat";
import useChatInput from "@/components/ChatInput";
import { useSidebarContext } from "@/components/SidebarContext";
import NewChat from "@/components/NewChat";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../../firebase";
import moment from "moment";
import { useRouter } from "next/navigation";
import { RxInfoCircled } from "react-icons/rx";
// import { genAI } from "@/lib/geminiApi";
import { GiFallingStar } from "react-icons/gi";
var randomstring = require("randomstring");

export default function Home() {
  const { data: session, status } = useSession();
  const { isOpen, setIsOpen, isQuota, geminiModel, setGeminiModel } =
    useSidebarContext();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const textareaRef = useRef(null);
  const router = useRouter();

  // const { prompt, promptOutput, render } = useChatInput({ chatId: id });

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

  //Main Functions

  const createNewChat = async () => {
    await addDoc(collection(db, "users", session?.user?.email, "chats"), {
      userId: session?.user?.email,
      createdAt: serverTimestamp(),
    })
      .then((res) => {
        console.log(res.id);
        return res.id;
      })
      .catch((err) => {
        console.log("err");
      });

    // router.push(`/chat/${doc.id}`);
  };

  function randomString() {
    const a = randomstring.generate(20);
    return a;
  }

  const sendMessage = async (chatId) => {
    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    try {
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
      ).catch((err) => console.log("addDoc", err));

      //Toast
      const notification = toast.loading("ChatGPT is thinking...");

      const genAI = new GoogleGenerativeAI(
        "AIzaSyCqbte8Mt26JRMRZt7xxZuPlxw_WKkQot4"
      );

      const model = genAI.getGenerativeModel({ model: geminiModel });

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
      ).catch((err) => {
        console.log("setDoc:", err);
      });

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setOutput(chunkText);
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
          console.log("Error2: ", err);
        });
    } catch (err) {
      console.log("Error2: ", err);
    }
  };

  const sendPrompt = async (f) => {
    f.preventDefault();
    if (!prompt) return;
    if (isQuota) {
      setPrompt("");
      toast.error("Api limit exceeded, please try again tomorrow.");
      return;
    }
    await addDoc(collection(db, "users", session?.user?.email, "chats"), {
      userId: session?.user?.email,
      createdAt: serverTimestamp(),
    })
      .then(async (res) => {
        console.log(res.id);
        router.replace(`/chat/${res.id}`);
        await sendMessage(res.id).then(() => {});
      })
      .catch((err) => {
        console.log("err", err);
      });

    // await createNewChat().then(async (id) => {
    //   router.replace(`/chat/${id}`);
    //   await sendMessage(id).then(() => {});
    //   console.log(id);
    // });
  };

  //Menu Functions

  const openMenu = () => {
    const menu = document.getElementById("MENU_BAR");
    const bg = document.getElementById("MENU_DARK_BACKGROUND");

    if (menu.offsetWidth === 0) {
      menu.classList.add("md:w-[260px]", "w-[280px]");
      menu.classList.remove("w-0");
      bg.classList.remove("hidden");
      menu.style.width = "260px";
      menu.style.visibility = "visible";
      setIsOpen(true);
    }
  };

  const closeMenu = () => {
    const menu = document.getElementById("MENU_BAR");
    const bg = document.getElementById("MENU_DARK_BACKGROUND");

    if (menu.offsetWidth != 0) {
      menu.classList.remove("md:w-[260px]", "w-[280px]");
      menu.classList.remove("w-0");
      bg.classList.add("hidden");
      menu.style.width = "0px";
      menu.style.visibility = "hidden";
      setIsOpen(false);
    }
  };

  return (
    <main className="w-full h-screen bg-[#212121] flex flex-col relative">
      <div className="w-full h-full flex flex-col relative">
        <div className="w-full h-full flex flex-col flex-1 relative overflow-y-auto ">
          <div className="w-full sticky top-0 left-0 px-4 py-2 items-center flex justify-between bg-[#212121] z-30">
            <button
              onClick={openMenu}
              className="w-5 h-6 md:hidden flex flex-col justify-evenly"
            >
              <span className="w-5 h-0.5 rounded-full bg-gray-300"></span>
              <span className="w-3 h-0.5 rounded-full bg-gray-300"></span>
            </button>
            <div className="flex gap-1 items-center">
              <div className={!isOpen ? "gap-2 hidden md:flex" : "hidden"}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        onClick={openMenu}
                        className="opacity-80 p-1 hover:bg-neutral-200/10 text-gray-300 rounded-md cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="icon-xl-heavy"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isOpen ? "Close Menu" : "Open Menu"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <NewChat />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none border-0">
                  <div className="relative text-gray-300/80 tracking-tight font-medium transition py-2 px-4 rounded-md hover:text-gray-300/80 hover:bg-slate-100/10 flex items-center gap-1 text-lg">
                    ChatGPT <IoIosArrowDown className="opacity-80" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2f2f2f] p-2 rounded-[18px] absolute top-full -translate-x-1/2 md:translate-x-0 md:-left-16 flex flex-col min-w-[260px] md:min-w-[320px]">
                  <DropdownMenuItem
                    onClick={() => setGeminiModel("gemini-1.5-pro")}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-md focus:bg-[#858585]/20  cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#424242] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-token-text-primary"
                      >
                        <path
                          fill="currentColor"
                          d="M15.11 14.285a.41.41 0 0 1 .78 0c.51 2.865.96 3.315 3.825 3.826.38.12.38.658 0 .778-2.865.511-3.315.961-3.826 3.826a.408.408 0 0 1-.778 0c-.511-2.865-.961-3.315-3.826-3.826a.408.408 0 0 1 0-.778c2.865-.511 3.315-.961 3.826-3.826Zm2.457-12.968a.454.454 0 0 1 .866 0C19 4.5 19.5 5 22.683 5.567a.454.454 0 0 1 0 .866C19.5 7 19 7.5 18.433 10.683a.454.454 0 0 1-.866 0C17 7.5 16.5 7 13.317 6.433a.454.454 0 0 1 0-.866C16.5 5 17 4.5 17.567 1.317"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M7.001 4a1 1 0 0 1 .993.887c.192 1.7.701 2.877 1.476 3.665.768.783 1.913 1.3 3.618 1.452a1 1 0 0 1-.002 1.992c-1.675.145-2.849.662-3.638 1.452-.79.79-1.307 1.963-1.452 3.638a1 1 0 0 1-1.992.003c-.152-1.706-.67-2.851-1.452-3.62-.788-.774-1.965-1.283-3.665-1.475a1 1 0 0 1-.002-1.987c1.73-.2 2.878-.709 3.646-1.476.767-.768 1.276-1.916 1.476-3.646A1 1 0 0 1 7 4Zm-2.472 6.998a6.1 6.1 0 0 1 2.468 2.412 6.2 6.2 0 0 1 1.037-1.376 6.2 6.2 0 0 1 1.376-1.036 6.1 6.1 0 0 1-2.412-2.469 6.2 6.2 0 0 1-1.053 1.416 6.2 6.2 0 0 1-1.416 1.053"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm text-white font-light tracking-tight ">
                        Gemini 1.5 Pro
                      </span>
                      <p className="text-[.725rem] text-[#a7a7a7]">
                        Powerful and Versatile
                      </p>
                    </div>
                    {geminiModel === "gemini-1.5-pro" && (
                      <div className="flex ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="icon-md"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m14.076-4.068a1 1 0 0 1 .242 1.393l-4.75 6.75a1 1 0 0 1-1.558.098l-2.5-2.75a1 1 0 0 1 1.48-1.346l1.66 1.827 4.032-5.73a1 1 0 0 1 1.394-.242"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setGeminiModel("gemini-1.5-flash")}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-md focus:bg-[#858585]/20  cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#424242] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-token-text-primary"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M12 7.42a22 22 0 0 0-2.453 2.127A22 22 0 0 0 7.42 12a22 22 0 0 0 2.127 2.453c.807.808 1.636 1.52 2.453 2.128a22 22 0 0 0 2.453-2.128A22 22 0 0 0 16.58 12a22 22 0 0 0-2.127-2.453A22 22 0 0 0 12 7.42m1.751-1.154a25 25 0 0 1 2.104 1.88 25 25 0 0 1 1.88 2.103c.316-.55.576-1.085.779-1.59.35-.878.507-1.625.503-2.206-.003-.574-.16-.913-.358-1.111-.199-.199-.537-.356-1.112-.36-.58-.003-1.328.153-2.205.504-.506.203-1.04.464-1.59.78Zm3.983 7.485a25 25 0 0 1-1.88 2.104 25 25 0 0 1-2.103 1.88 13 13 0 0 0 1.59.779c.878.35 1.625.507 2.206.503.574-.003.913-.16 1.111-.358.199-.199.356-.538.36-1.112.003-.58-.154-1.328-.504-2.205a13 13 0 0 0-.78-1.59ZM12 18.99c.89.57 1.768 1.03 2.605 1.364 1.026.41 2.036.652 2.955.646.925-.006 1.828-.267 2.5-.94.673-.672.934-1.575.94-2.5.006-.919-.236-1.929-.646-2.954A15.7 15.7 0 0 0 18.99 12a15.6 15.6 0 0 0 1.364-2.606c.41-1.025.652-2.035.646-2.954-.006-.925-.267-1.828-.94-2.5-.672-.673-1.575-.934-2.5-.94-.919-.006-1.929.235-2.954.646-.838.335-1.716.795-2.606 1.364a15.7 15.7 0 0 0-2.606-1.364C8.37 3.236 7.36 2.994 6.44 3c-.925.006-1.828.267-2.5.94-.673.672-.934 1.575-.94 2.5-.006.919.235 1.929.646 2.955A15.7 15.7 0 0 0 5.01 12c-.57.89-1.03 1.768-1.364 2.605-.41 1.026-.652 2.036-.646 2.955.006.925.267 1.828.94 2.5.672.673 1.575.934 2.5.94.92.006 1.93-.235 2.955-.646A15.7 15.7 0 0 0 12 18.99m-1.751-1.255a25 25 0 0 1-2.104-1.88 25 25 0 0 1-1.88-2.104c-.315.55-.576 1.085-.779 1.59-.35.878-.507 1.625-.503 2.206.003.574.16.913.359 1.111.198.199.537.356 1.111.36.58.003 1.328-.153 2.205-.504.506-.203 1.04-.463 1.59-.78Zm-3.983-7.486a25 25 0 0 1 1.88-2.104 25 25 0 0 1 2.103-1.88 13 13 0 0 0-1.59-.779c-.878-.35-1.625-.507-2.206-.503-.574.003-.913.16-1.111.359-.199.198-.356.537-.36 1.111-.003.58.153 1.328.504 2.205.203.506.464 1.04.78 1.59Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm text-white font-light tracking-tight ">
                        Gemini 1.5 Flash
                      </span>
                      <p className="text-[.725rem] text-[#a7a7a7]">
                        Speed and Efficient
                      </p>
                    </div>
                    {geminiModel === "gemini-1.5-flash" && (
                      <div className="flex ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="icon-md"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m14.076-4.068a1 1 0 0 1 .242 1.393l-4.75 6.75a1 1 0 0 1-1.558.098l-2.5-2.75a1 1 0 0 1 1.48-1.346l1.66 1.827 4.032-5.73a1 1 0 0 1 1.394-.242"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setGeminiModel("gemini-1.0-pro")}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-md focus:bg-[#858585]/20 cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#424242] flex items-center justify-center">
                      <GiFallingStar className="w-[16px] h-[16px]" />
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm text-white font-light tracking-tight ">
                        Gemini 1.0 Pro
                      </span>
                      <p className="text-[.725rem] text-[#a7a7a7]">
                        Initial Major release.
                      </p>
                    </div>
                    {geminiModel === "gemini-1.0-pro" && (
                      <div className="flex ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="icon-md"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m14.076-4.068a1 1 0 0 1 .242 1.393l-4.75 6.75a1 1 0 0 1-1.558.098l-2.5-2.75a1 1 0 0 1 1.48-1.346l1.66 1.827 4.032-5.73a1 1 0 0 1 1.394-.242"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-8 h-8 rounded-full relative overflow-hidden ring-transparent ring-4 transition hover:ring-[#9e9e9e]/30 cursor-pointer ">
              {!session ? (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="">
                    <Image
                      src={session?.user?.image}
                      fill
                      objectFit="cover"
                      alt=""
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#2f2f2f] p-2 rounded-[18px] absolute top-full -right-3 flex flex-col w-max">
                    <DropdownMenuItem className="flex items-center gap-2 w-full pl-4 pr-10 py-3 rounded-md hover:bg-[#6b6b6b]/50 text-gray-100 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 shrink-0"
                      >
                        <path
                          fill="currentColor"
                          d="M10.663 6.387c.152-.096.337.023.337.203V8a1 1 0 1 0 2 0V6.59c0-.18.185-.3.337-.203a2.5 2.5 0 0 1-.357 4.413 1 1 0 0 1 .02.2v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 .02-.2 2.5 2.5 0 0 1-.357-4.413"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M17.975 4.01A8 8 0 0 0 17.4 4H9.8c-.857 0-1.439 0-1.889.038-.438.035-.663.1-.819.18a2 2 0 0 0-.874.874c-.08.156-.145.38-.18.819C6 6.361 6 6.943 6 7.8v8.37c.313-.11.65-.17 1-.17h11V4.6c0-.297 0-.459-.01-.575l-.001-.014zM17.657 18H7a1 1 0 1 0 0 2h10.657a5.5 5.5 0 0 1 0-2M4 19V7.759c0-.805 0-1.47.044-2.01.046-.563.145-1.08.392-1.565a4 4 0 0 1 1.748-1.748c.485-.247 1.002-.346 1.564-.392C8.29 2 8.954 2 9.758 2h7.674c.252 0 .498 0 .706.017.229.019.499.063.77.201a2 2 0 0 1 .874.874c.138.271.182.541.201.77.017.208.017.454.017.706V17a1 1 0 0 1-.078.386c-.476 1.14-.476 2.089 0 3.228A1 1 0 0 1 19 22H7a3 3 0 0 1-3-3"
                        ></path>
                      </svg>
                      Customize ChatGPT
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 w-full pl-4 pr-10 py-3 rounded-md hover:bg-[#6b6b6b]/50 text-gray-100 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 shrink-0"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M11.568 3.5a1 1 0 0 0-.863.494l-.811 1.381A3 3 0 0 1 7.33 6.856l-1.596.013a1 1 0 0 0-.858.501l-.44.761a1 1 0 0 0-.003.992l.792 1.4a3 3 0 0 1 0 2.954l-.792 1.4a1 1 0 0 0 .004.992l.439.76a1 1 0 0 0 .858.502l1.596.013a3 3 0 0 1 2.564 1.48l.811 1.382a1 1 0 0 0 .863.494h.87a1 1 0 0 0 .862-.494l.812-1.381a3 3 0 0 1 2.563-1.481l1.596-.013a1 1 0 0 0 .859-.501l.439-.761a1 1 0 0 0 .004-.992l-.793-1.4a3 3 0 0 1 0-2.953l.793-1.401a1 1 0 0 0-.004-.992l-.439-.76a1 1 0 0 0-.859-.502l-1.596-.013a3 3 0 0 1-2.563-1.48L13.3 3.993a1 1 0 0 0-.862-.494zM8.98 2.981A3 3 0 0 1 11.568 1.5h.87a3 3 0 0 1 2.588 1.481l.81 1.382a1 1 0 0 0 .855.494l1.597.013a3 3 0 0 1 2.575 1.502l.44.76a3 3 0 0 1 .011 2.975l-.792 1.4a1 1 0 0 0 0 .985l.792 1.401a3 3 0 0 1-.012 2.974l-.439.761a3 3 0 0 1-2.575 1.503l-1.597.012a1 1 0 0 0-.854.494l-.811 1.382a3 3 0 0 1-2.588 1.481h-.87a3 3 0 0 1-2.588-1.481l-.811-1.382a1 1 0 0 0-.855-.494l-1.596-.012a3 3 0 0 1-2.576-1.503l-.439-.76a3 3 0 0 1-.012-2.975l.793-1.4a1 1 0 0 0 0-.985l-.793-1.4a3 3 0 0 1 .012-2.975l.44-.761A3 3 0 0 1 5.717 4.87l1.596-.013a1 1 0 0 0 .855-.494z"
                          clipRule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M12.003 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M8.502 12a3.5 3.5 0 1 1 7 .001 3.5 3.5 0 0 1-7-.001"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Settings
                    </DropdownMenuItem>
                    <div className="w-full h-[.4px] bg-neutral-500/40 my-2"></div>
                    <DropdownMenuItem
                      className="flex items-center gap-2 w-full pl-4 pr-10 py-3 rounded-md hover:bg-[#6b6b6b]/50 text-gray-100 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 shrink-0"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M6 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h4a1 1 0 1 1 0 2zm9.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L17.586 13H11a1 1 0 1 1 0-2h6.586l-2.293-2.293a1 1 0 0 1 0-1.414"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isQuota && (
              <div className="absolute w-full top-full left-0 py-1.5 px-4 leading-5 flex gap-2 items-center justify-center bg-[#50472c] text-[.825rem] font-mono font-light">
                <RxInfoCircled className="text-[105%]" />
                Sorry, you have exhauster your daily API limit. Please try again
                tomorrow.
              </div>
            )}
          </div>
          {/* Chat */}
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-12 overflow-y-hidden px-4 ">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              role="img"
            >
              <text x="-9999" y="-9999">
                ChatGPT
              </text>
              <path
                d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                fill="currentColor"
              ></path>
            </svg>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-200/70">
              <div className="flex gap-4 h-auto">
                <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md"
                      style={{ color: "rgb(203, 139, 208)" }}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M3 6h7M3 10h4"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.428 17.572 20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547"
                      ></path>
                    </svg>
                  </span>
                  <p className="font-light text-[#b1b1b1] leading-6">
                    Content calendar for TikTok
                  </p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md"
                      style={{ color: "rgb(226, 197, 65)" }}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19a3 3 0 1 1-6 0M15.865 16A7.54 7.54 0 0 0 19.5 9.538C19.5 5.375 16.142 2 12 2S4.5 5.375 4.5 9.538A7.54 7.54 0 0 0 8.135 16m7.73 0h-7.73m7.73 0v3h-7.73v-3"
                      ></path>
                    </svg>
                  </span>
                  <p className="font-light text-[#b1b1b1] leading-6">
                    Design a fun coding game
                  </p>
                </div>
              </div>
              <div className="flex gap-4 h-auto">
                <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md"
                      style={{ color: "rgb(118, 208, 235)" }}
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M12.455 4.105a1 1 0 0 0-.91 0L1.987 8.982 1.077 7.2l9.56-4.877a3 3 0 0 1 2.726 0l9.56 4.877A1.98 1.98 0 0 1 24 9.22V15a1 1 0 1 1-2 0v-3.784l-2.033.995v4.094a3 3 0 0 1-1.578 2.642l-4.967 2.673a3 3 0 0 1-2.844 0l-4.967-2.673a3 3 0 0 1-1.578-2.642v-4.094l-2.927-1.433C-.374 10.053-.39 7.949 1.077 7.2l.91 1.782 9.573 4.689a1 1 0 0 0 .88 0L22 8.989v-.014zM6.033 13.19v3.114a1 1 0 0 0 .526.88l4.967 2.674a1 1 0 0 0 .948 0l4.967-2.673a1 1 0 0 0 .526-.88V13.19l-4.647 2.276a3 3 0 0 1-2.64 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <p className="font-light text-[#b1b1b1] leading-6">
                    Quiz me on ancient civilizations
                  </p>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md"
                      style={{ color: "rgb(226, 197, 65)" }}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m9.65 13.026-3.287 1.19A2 2 0 0 1 3.8 13.027l-.342-.934.597-1.275L1.75 7.419l2.348-.85 2.564 1.484a2 2 0 0 0 1.689.15l8.512-3.083c.291-.106.603-.142.912-.107l2.833.325a1.842 1.842 0 0 1 .422 3.565l-5.276 1.911m.598-1.275L13 14.5l-2.817 1.02-.343-3.622"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M3 19h18"
                      ></path>
                    </svg>
                  </span>
                  <p className="font-light text-[#b1b1b1] leading-6">
                    Plan a relaxing day
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ChatInput */}
        <div className="w-full px-4 flex flex-col items-center ">
          <form className="w-full max-w-screen-md mx-auto relative rounded-[24px] bg-[#2f2f2f] flex items-end gap-2 pl-4 pr-2 py-2">
            <div className="flex-1 flex items-center py-1">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    return;
                  }
                }}
                onKeyDown={(f) => {
                  if (f.key === "Enter" && !f.shiftKey) {
                    f.preventDefault();
                    sendPrompt(f);
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
              onClick={sendPrompt}
              disabled={!prompt || !session}
              className=" disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-neutral-700 w-8 h-8 rounded-full bg-neutral-300 hover:bg-gray-400 text-neutral-900  flex items-center justify-center text-lg"
            >
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
            </button>
          </form>
          <div className="text-neutral-400 text-xs relative w-full text-center bg-[#212121] py-2">
            ChatGPT can make mistakes. Check important info.
            <button className="absolute top-1/2 right-0 -translate-y-1/2 text-[1rem] ">
              <BsQuestionCircle />
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={closeMenu}
        id="MENU_DARK_BACKGROUND"
        className="hidden md:hidden absolute top-0 left-0 w-full h-screen bg-black/70 z-30"
      ></div>
    </main>
  );
}
