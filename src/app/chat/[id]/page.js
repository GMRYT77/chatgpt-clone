"use client";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
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
// import ChatInput from "@/components/ChatInput";
import Chat from "@/components/Chat";
import useChatInput from "@/components/ChatInput";
import NewChat from "@/components/NewChat";
import { useSidebarContext } from "@/components/SidebarContext";

const page = ({ params: { id } }) => {
  const { data: session, status } = useSession();
  const { prompt, promptOutput, render } = useChatInput({ chatId: id });
  const { isOpen, setIsOpen } = useSidebarContext();

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
    <main className="w-full h-[100vh] bg-[#212121]">
      <div className="w-full h-full flex flex-col justify-between relative overflow-y-auto ">
        <div
          onClick={openMenu}
          className="w-full sticky top-0 left-0 px-4 py-2 items-center flex justify-between bg-[#212121] z-30"
        >
          <button className="w-5 h-6 md:hidden flex flex-col justify-evenly">
            <span className="w-5 h-0.5 rounded-full bg-gray-300"></span>
            <span className="w-3 h-0.5 rounded-full bg-gray-300"></span>
          </button>
          <div className="flex gap-1">
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
            <Button
              variant="ghost"
              className="text-gray-300/80 tracking-tight font-medium hover:text-gray-300/80 hover:bg-slate-100/10 flex items-center gap-1 text-lg"
            >
              ChatGPT <IoIosArrowDown className="opacity-80" />
            </Button>
          </div>
          <div className="w-8 h-8 rounded-full relative overflow-hidden">
            {!session ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger>
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
        </div>
        <Chat chatId={id} promptOutput={promptOutput} />
        {render}
      </div>

      <div
        onClick={closeMenu}
        id="MENU_DARK_BACKGROUND"
        className="hidden md:hidden absolute top-0 left-0 w-full h-screen bg-black/70 z-30"
      ></div>
    </main>
  );
};

export default page;
