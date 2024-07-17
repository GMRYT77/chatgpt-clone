"use client";
import React from "react";
import { useSidebarContext } from "./SidebarContext";

const BgCloseComp = () => {
  const { setIsOpen } = useSidebarContext();
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
    <div
      onClick={closeMenu}
      id="MENU_DARK_BACKGROUND"
      className="hidden md:hidden absolute top-0 left-0 w-full h-screen bg-black/70 z-30"
    ></div>
  );
};

export default BgCloseComp;
