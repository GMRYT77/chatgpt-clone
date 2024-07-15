"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiDotsHorizontal } from "react-icons/hi";
import NewChat from "./NewChat";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import ChatRow from "./ChatRow";
import { RiLoader2Line } from "react-icons/ri";
import { useSidebarContext } from "./SidebarContext";
import Image from "next/image";
import { LuMoveUpRight } from "react-icons/lu";
import { timeDescription } from "@/lib/timestampToDate";

const Sidebar = () => {
  const { data: session } = useSession();
  const { isOpen, setIsOpen, isQuota, setIsQuota } = useSidebarContext();
  const [timsStampChats, setTimeStampChats] = useState([]);
  let dict = {};
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email, "chats"),
        orderBy("createdAt", "desc")
      )
  );
  useEffect(() => {
    if (!loading) {
      if (error?.code === "resource-exhausted" && chats?.docs === undefined) {
        setIsQuota(true);
      }
    }
  }, [loading]);

  const closeMenu = () => {
    const menu = document.getElementById("MENU_BAR");
    const bg = document.getElementById("MENU_DARK_BACKGROUND");

    if (menu.offsetWidth != 0) {
      menu.classList.remove("md:w-[260px]");
      menu.classList.add("w-0");
      bg.classList.add("hidden");
      menu.style.width = "0px";
      menu.style.visibility = "hidden";
      setIsOpen(false);
    }
  };

  return (
    <div
      id="MENU_BAR"
      className="bg-[#171717] absolute top-0 left-0 md:static h-full md:h-auto flex-shrink-0 overflow-x-hidden transition-all duration-200  
                ease-in-out z-50 w-0 md:w-[260px]"
      // style={{ width: "260px", visibility: "visible" }}
    >
      <div className="h-full w-[260px]">
        <div className="flex min-h-0 flex-col h-full">
          <div className="relative w-full h-full flex-1 items-start">
            <nav className="flex h-full w-full flex-col p-2">
              <div className="flex w-full p-2 justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        onClick={closeMenu}
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
                      <p>Close Menu</p>
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

              <div className="flex flex-col flex-1 overflow-y-auto sb px-2 pb-5">
                {loading ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <RiLoader2Line className="text-lg animate-spin" />
                  </div>
                ) : chats?.docs === undefined &&
                  error?.code === "resource-exhausted" &&
                  isQuota ? (
                  <div className="w-full h-full flex justify-center items-center text-sm text-gray-400">
                    <span>{error?.message}</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {/* ChatBlock */}
                    <div className="flex flex-col">
                      {chats?.docs?.map((chat) => {
                        let ts = chat?.data()?.createdAt?.toDate();

                        return (
                          <>
                            <h5 className="text-xs font-[400] text-neutral-300/80 tracking-tight px-2 mb-2 mt-6">
                              {timeDescription(ts)}
                            </h5>
                            <ChatRow key={chat?.id} id={chat?.id} />
                          </>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-2 py-1 w-full">
                <button className="w-full relative group rounded-lg transition hover:bg-gray-200/10 flex gap-2 p-2">
                  <div className="relative w-6 h-6 bg-gray-600 my-auto ">
                    <Image src={"/logo2.png"} fill objectFit="cover" alt="" />
                  </div>
                  <div className="text-sm text-left -space-y-1 flex-1">
                    <span className="text-[90%] opacity-90">ChatGPT Clone</span>
                    <p className="text-[80%] text-gray-400">by Raj Aryan</p>
                  </div>
                  <div className="my-auto flex justify-center h-full pr-2">
                    <LuMoveUpRight className="opacity-0 group-hover:opacity-70 text-lg rotate-45 group-hover:rotate-0 transition-transform duration-300 ease-in-out" />
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
