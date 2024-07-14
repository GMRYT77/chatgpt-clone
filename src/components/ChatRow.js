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
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";

import Link from "next/link";
import { db } from "../../firebase";

const ChatRow = ({ id }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);

  const [messages, loading, error] = useCollection(
    collection(db, "users", session?.user?.email, "chats", id, "messages")
  );

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [pathname]);

  const removeChat = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email, "chats", id)).then(
      () => router.replace("/")
    );
  };
  return (
    <Link
      id={id}
      href={`/chat/${id}`}
      className={`relative group text-clip whitespace-nowrap overflow-hidden w-full rounded-md text-[.85rem] font-light p-2 cursor-pointer tracking-tight ${
        active ? "bg-[#212121]" : "hover:bg-[#212121]/90 "
      }`}
    >
      {messages?.docs?.[messages?.docs.length - 1]?.data().text || "New Chat"}
      <div className="absolute top-0 right-0 flex h-full">
        <div
          className={` h-full rounded-ee-sm group-hover:rounded-none w-12 bg-gradient-to-l  group-hover:from-[#212121] ${
            active ? "from-[#212121]" : "from-[#171717]"
          }`}
        ></div>
        <div
          className={`${
            active ? "flex" : "hidden"
          } group-hover:flex h-full bg-[#212121]  items-center px-2 text-lg text-gray-400/80`}
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
            <DropdownMenuContent>
              <DropdownMenuItem onClick={removeChat}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Link>
  );
};

export default ChatRow;
