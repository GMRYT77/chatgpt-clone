"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isQuota, setIsQuota] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isQuota, setIsQuota }}>
      {children}
    </SidebarContext.Provider>
  );
}
export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
