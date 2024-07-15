import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SessionProvider } from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import Login from "@/components/Login";
import { authOptions } from "@/lib/authOptions";
import ClientProvider from "@/components/ClientProvider";
import { SidebarWrapper } from "@/components/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatGPT Clone",
  description: "...",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative w-full h-full max-w-full overflow-hidden">
          <SessionProvider session={session}>
            {!session ? (
              <Login />
            ) : (
              <div className="relative flex w-full h-full">
                <SidebarWrapper>
                  <Sidebar />
                  <ClientProvider />
                  <div className="w-full flex-1 transition">{children}</div>
                </SidebarWrapper>
              </div>
            )}
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
