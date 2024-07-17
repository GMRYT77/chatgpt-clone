import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SessionProvider } from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import Login from "@/components/Login";
import { authOptions } from "@/lib/authOptions";
import ClientProvider from "@/components/ClientProvider";
import { SidebarWrapper } from "@/components/SidebarContext";
import BgCloseComp from "@/components/BgCloseComp";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatGPT Clone",
  description: "...",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="dark">
      <body
        className={`relative flex h-full w-full m-0 p-0 ${inter.className}`}
      >
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <div className="relative flex w-full h-[100dvh] overflow-hidden ">
              <SidebarWrapper>
                <Sidebar />
                <ClientProvider />
                <div className="w-full  transition">{children}</div>
                <BgCloseComp />
              </SidebarWrapper>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
