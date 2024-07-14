"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}
export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
