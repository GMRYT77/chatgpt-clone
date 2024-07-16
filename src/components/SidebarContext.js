"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isQuota, setIsQuota] = useState(false);
  const [sidebarTs, setSidebarTs] = useState({});
  const [geminiModel, setGeminiModel] = useState("gemini-1.5-flash");

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isQuota,
        setIsQuota,
        geminiModel,
        setGeminiModel,
        sidebarTs,
        setSidebarTs,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
