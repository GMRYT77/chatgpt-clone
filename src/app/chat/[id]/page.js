"use client";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import ChatInput from "@/components/ChatInput";
import Chat from "@/components/Chat";
import useChatInput from "@/components/ChatInput";

const page = ({ params: { id } }) => {
  const { data: session, status } = useSession();
  const { prompt, promptOutput, render } = useChatInput({ chatId: id });

  const openMenu = () => {
    const menu = document.getElementById("MENU_BAR");
    const bg = document.getElementById("MENU_DARK_BACKGROUND");
    if (menu.classList.contains("-translate-x-full")) {
      menu.classList.remove("-translate-x-full");
      menu.classList.add("transition", "translate-x-0");
    }
    if (bg.classList.contains("hidden")) {
      bg.classList.remove("hidden");
    }
  };

  const closeMenu = () => {
    const menu = document.getElementById("MENU_BAR");
    const bg = document.getElementById("MENU_DARK_BACKGROUND");
    if (menu.classList.contains("translate-x-0")) {
      menu.classList.add("-translate-x-full");
      menu.classList.remove("translate-x-0", "transition");
    }
    if (!bg.classList.contains("hidden")) {
      bg.classList.add("hidden");
    }
  };
  return (
    <main className="w-full h-screen bg-[#212121] flex flex-col relative">
      <div className="w-full h-full flex flex-col relative">
        <div className="w-full h-full flex flex-col flex-1 relative overflow-y-auto ">
          <div className="w-full sticky top-0 left-0 px-4 py-2 items-center flex justify-between bg-[#212121]">
            <button
              onClick={openMenu}
              className="w-5 h-6 md:hidden flex flex-col justify-evenly"
            >
              <span className="w-5 h-0.5 rounded-full bg-gray-300"></span>
              <span className="w-3 h-0.5 rounded-full bg-gray-300"></span>
            </button>
            <Button
              variant="ghost"
              className="text-gray-300/80 tracking-tight font-medium hover:text-gray-300/80 hover:bg-slate-100/10 flex items-center gap-1 text-lg"
            >
              ChatGPT <IoIosArrowDown className="opacity-80" />
            </Button>
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
                  <DropdownMenuContent className="bg-[#171717] p-0 rounded-sm">
                    <DropdownMenuItem onClick={() => signOut()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <Chat chatId={id} promptOutput={promptOutput} />
        </div>
        {render}
      </div>
      <div
        onClick={closeMenu}
        id="MENU_DARK_BACKGROUND"
        className="hidden absolute top-0 left-0 w-full h-screen bg-black/70 z-30"
      ></div>
    </main>
  );
};

export default page;
