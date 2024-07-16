"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HiDotsHorizontal } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  deleteDoc,
  doc,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import removeMarkdown from "markdown-to-text";

import Link from "next/link";
import { db } from "../../firebase";
import { useSidebarContext } from "./SidebarContext";

const ChatRow = ({ id, ts }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { sidebarTs, setSidebarTs, setIsOpen } = useSidebarContext();

  const [messages, loading, error] = useCollection(
    query(
      collection(db, "users", session?.user?.email, "chats", id, "messages"),
      limit(1),
      orderBy("createdAt", "desc")
    )
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname]);

  useEffect(() => {
    let arr = {};
    if (!sidebarTs[ts]) {
      setSidebarTs((e) => ({ ...e, [ts]: true }));
    }
    setLoaded(true);
    console.log(sidebarTs[ts]);
  }, [loaded]);

  const closeMenu = () => {
    const menu = document.getElementById("MENU_BAR");
    const bg = document.getElementById("MENU_DARK_BACKGROUND");

    if (menu.offsetWidth != 0 && window.innerWidth < 768) {
      menu.classList.remove("md:w-[260px]", "w-[280px]");
      menu.classList.remove("w-0");
      bg.classList.add("hidden");
      menu.style.width = "0px";
      menu.style.visibility = "hidden";
      setIsOpen(false);
    }
  };

  const removeChat = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email, "chats", id)).then(
      () => router.replace("/")
    );
  };
  return (
    <>
      <Link
        id={id}
        href={`/chat/${id}`}
        className={`relative group text-start  overflow-hidden w-full rounded-md text-[.85rem] font-light p-2 cursor-pointer tracking-tight ${
          active ? "bg-[#212121]" : "hover:bg-[#212121]/80 "
        }`}
        onClick={closeMenu}
      >
        <span className="text-clip whitespace-nowrap">
          {removeMarkdown(
            messages?.docs?.[messages?.docs?.length - 1]?.data().text
          ).slice(0, 50) === "loading" ? (
            <div className="flex space-x-1 justify-center items-center w-fit h-[16.4px]">
              <span className="sr-only">Loading...</span>
              <div className="h-1 w-1 bg-[#686868] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 bg-[#686868] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 bg-[#686868] rounded-full animate-bounce"></div>
            </div>
          ) : (
            removeMarkdown(
              messages?.docs?.[messages?.docs?.length - 1]?.data().text
            ).slice(0, 60) || "New Chat"
          )}
        </span>

        <div className="absolute top-0 right-0 flex h-full">
          <div
            className={` h-full rounded-ee-sm group-hover:rounded-none w-12 bg-gradient-to-l group-hover:from-[#212121] ${
              active ? "from-[#212121]" : "from-[#171717]"
            }`}
          ></div>
          <div
            className={`${
              active ? "w-fit px-2" : "w-0 px-0"
            } group-hover:visible  group-hover:w-fit group-hover:px-2 flex h-full bg-[#212121] items-center  text-lg text-gray-400/80`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="h-full flex items-center">
                      <HiDotsHorizontal className="hover:text-gray-200" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute -top-7 left-0 p-2 rounded-[12px] bg-[#2f2f2f] text-[.95rem] font-[400]">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 focus:bg-[#646464]/30 cursor-pointer rounded-md ">
                  <span>
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
                        d="M11.293 3.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L13 6.414V15a1 1 0 1 1-2 0V6.414L8.707 8.707a1 1 0 0 1-1.414-1.414zM4 14a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 focus:bg-[#646464]/30 cursor-pointer rounded-md ">
                  <span>
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
                        d="M13.293 4.293a4.536 4.536 0 1 1 6.414 6.414l-1 1-7.094 7.094A5 5 0 0 1 8.9 20.197l-4.736.79a1 1 0 0 1-1.15-1.151l.789-4.736a5 5 0 0 1 1.396-2.713zM13 7.414l-6.386 6.387a3 3 0 0 0-.838 1.628l-.56 3.355 3.355-.56a3 3 0 0 0 1.628-.837L16.586 11zm5 2.172L14.414 6l.293-.293a2.536 2.536 0 0 1 3.586 3.586z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 focus:bg-[#646464]/30 cursor-pointer rounded-md ">
                  <span>
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
                        d="M4.83 4.106A2 2 0 0 1 6.617 3h10.764a2 2 0 0 1 1.789 1.106l1.618 3.236a2 2 0 0 1 .211.894V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8.236a2 2 0 0 1 .211-.894zM17.381 5H6.618l-1 2h12.764zM19 9H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM9 12a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  Archieve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={removeChat}
                  className="flex items-center gap-2 px-4 py-2.5 focus:bg-[#646464]/30 cursor-pointer rounded-md text-red-500"
                >
                  <span>
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
                        d="M10.556 4a1 1 0 0 0-.97.751l-.292 1.14h5.421l-.293-1.14A1 1 0 0 0 13.453 4zm6.224 1.892-.421-1.639A3 3 0 0 0 13.453 2h-2.897A3 3 0 0 0 7.65 4.253l-.421 1.639H4a1 1 0 1 0 0 2h.1l1.215 11.425A3 3 0 0 0 8.3 22H15.7a3 3 0 0 0 2.984-2.683l1.214-11.425H20a1 1 0 1 0 0-2zm1.108 2H6.112l1.192 11.214A1 1 0 0 0 8.3 20H15.7a1 1 0 0 0 .995-.894zM10 10a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Link>{" "}
    </>
  );
};

export default ChatRow;
