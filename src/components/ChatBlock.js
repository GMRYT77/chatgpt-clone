"use client";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import ChatRow from "./ChatRow";

const ChatBlock = () => {
  const { data: session } = useSession();
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  const startOfLastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );
  const startOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email, "chats"),
        where("createdAt", ">=", startOfToday),
        where("createdAt", "<=", now),
        orderBy("createdAt", "desc")
      )
  );
  useEffect(() => {
    console.log(chats?.docs);
  }, [loading]);

  if (!loading && chats?.docs?.length === 0)
    return <div className="">No data</div>;
  return (
    <div className="flex flex-col">
      <h5 className="text-xs font-[400] text-neutral-300/80 tracking-tight px-2 mb-2 mt-6">
        Today
      </h5>
      {!loading
        ? chats?.docs?.map((chat) => {
            // let ts = chat?.data()?.createdAt?.toDate();

            return (
              <>
                {/* <ChatRow key={chat?.id} id={chat?.id} /> */}
                <div className="">{chat?.id}</div>
              </>
            );
          })
        : "loadinggg"}
    </div>
  );
};

export default ChatBlock;
