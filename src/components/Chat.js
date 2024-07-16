"use client";
import { collection, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { useSession } from "next-auth/react";
import OutputMessage from "./OutputMessage";
import InputMessage from "./InputMessage";
import { MdOutlineArrowDownward } from "react-icons/md";
import { useSidebarContext } from "./SidebarContext";

const Chat = ({ chatId, promptOutput }) => {
  const { data: session, status } = useSession();
  const [isInViewport, setIsInViewport] = useState(false);
  const { isQuota } = useSidebarContext();
  const messagesEndRef = useRef(null);

  const [messages, loading, error] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, promptOutput]);

  useEffect(() => {
    const target = messagesEndRef.current;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
        } else {
          setIsInViewport(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection);

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  });

  if (loading) return <div className=""></div>;
  return messages?.docs.length === 0 ? (
    <div className="w-full flex-1 flex flex-col items-center justify-center gap-12 overflow-y-hidden px-4 ">
      <svg
        width="41"
        height="41"
        viewBox="0 0 41 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        role="img"
      >
        <text x="-9999" y="-9999">
          ChatGPT
        </text>
        <path
          d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
          fill="currentColor"
        ></path>
      </svg>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-200/70">
        <div className="flex gap-4 h-auto">
          <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="icon-md"
                style={{ color: "rgb(203, 139, 208)" }}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M3 6h7M3 10h4"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.428 17.572 20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547"
                ></path>
              </svg>
            </span>
            <p className="font-light text-[#b1b1b1] leading-6">
              Content calendar for TikTok
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="icon-md"
                style={{ color: "rgb(226, 197, 65)" }}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19a3 3 0 1 1-6 0M15.865 16A7.54 7.54 0 0 0 19.5 9.538C19.5 5.375 16.142 2 12 2S4.5 5.375 4.5 9.538A7.54 7.54 0 0 0 8.135 16m7.73 0h-7.73m7.73 0v3h-7.73v-3"
                ></path>
              </svg>
            </span>
            <p className="font-light text-[#b1b1b1] leading-6">
              Design a fun coding game
            </p>
          </div>
        </div>
        <div className="flex gap-4 h-auto">
          <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="icon-md"
                style={{ color: "rgb(118, 208, 235)" }}
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M12.455 4.105a1 1 0 0 0-.91 0L1.987 8.982 1.077 7.2l9.56-4.877a3 3 0 0 1 2.726 0l9.56 4.877A1.98 1.98 0 0 1 24 9.22V15a1 1 0 1 1-2 0v-3.784l-2.033.995v4.094a3 3 0 0 1-1.578 2.642l-4.967 2.673a3 3 0 0 1-2.844 0l-4.967-2.673a3 3 0 0 1-1.578-2.642v-4.094l-2.927-1.433C-.374 10.053-.39 7.949 1.077 7.2l.91 1.782 9.573 4.689a1 1 0 0 0 .88 0L22 8.989v-.014zM6.033 13.19v3.114a1 1 0 0 0 .526.88l4.967 2.674a1 1 0 0 0 .948 0l4.967-2.673a1 1 0 0 0 .526-.88V13.19l-4.647 2.276a3 3 0 0 1-2.64 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
            <p className="font-light text-[#b1b1b1] leading-6">
              Quiz me on ancient civilizations
            </p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl cursor-pointer space-y-1 font-light border border-gray-400/10 p-3 w-40 h-full transition hover:bg-gray-400/10">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                className="icon-md"
                style={{ color: "rgb(226, 197, 65)" }}
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9.65 13.026-3.287 1.19A2 2 0 0 1 3.8 13.027l-.342-.934.597-1.275L1.75 7.419l2.348-.85 2.564 1.484a2 2 0 0 0 1.689.15l8.512-3.083c.291-.106.603-.142.912-.107l2.833.325a1.842 1.842 0 0 1 .422 3.565l-5.276 1.911m.598-1.275L13 14.5l-2.817 1.02-.343-3.622"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M3 19h18"
                ></path>
              </svg>
            </span>
            <p className="font-light text-[#b1b1b1] leading-6">
              Plan a relaxing day
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : isQuota ? (
    <div className="flex-1 w-full px-4">
      <div className="w-full max-w-screen-md mx-auto relative flex flex-col pb-2 pt-6 ">
        <div className="w-full flex justify-end items-end mb-10 mt-12">
          <span className="w-fit max-w-[90%] md:max-w-[75%] py-2.5 px-4 bg-[#2f2f2f] rounded-[40px] font-light text-[.95rem]">
            Where's my Prompt?
          </span>
        </div>
        <div className="w-full relative mb-14 text-[.925rem] text-gray-100">
          <div className="flex w-full max-w-[90%] gap-6 relative">
            <div className="w-8 h-8 min-w-8 flex items-center justify-center ring-[.4px] ring-gray-300 rounded-full">
              <svg
                width="18"
                height="18"
                viewBox="0 0 41 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-md"
                role="img"
              >
                <text x="-9999" y="-9999">
                  ChatGPT
                </text>
                <path
                  d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="flex-1 flex flex-col relative overflow-x-hidden">
              <div className="text-gray-200 flex flex-col">
                Sorry, your api limit is exceeded. Please try again tomorrow.
              </div>
              <div className="w-full pt-3 flex gap-1">
                <button className="rounded-sm hover:bg-[#2f2f2f] p-1 text-gray-400">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md-heavy"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M11 4.91a.5.5 0 0 0-.838-.369L6.676 7.737A1 1 0 0 1 6 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2a1 1 0 0 1 .676.263l3.486 3.196A.5.5 0 0 0 11 19.09zM8.81 3.067C10.415 1.597 13 2.735 13 4.91v14.18c0 2.175-2.586 3.313-4.19 1.843L5.612 18H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1.611zm11.507 3.29a1 1 0 0 1 1.355.401A10.96 10.96 0 0 1 23 12c0 1.85-.458 3.597-1.268 5.13a1 1 0 1 1-1.768-.934A8.96 8.96 0 0 0 21 12a8.96 8.96 0 0 0-1.085-4.287 1 1 0 0 1 .402-1.356M15.799 7.9a1 1 0 0 1 1.4.2 6.48 6.48 0 0 1 1.3 3.9c0 1.313-.39 2.537-1.06 3.56a1 1 0 0 1-1.673-1.096A4.47 4.47 0 0 0 16.5 12a4.47 4.47 0 0 0-.9-2.7 1 1 0 0 1 .2-1.4"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
                <button className="rounded-sm hover:bg-[#2f2f2f] p-1 text-gray-400">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md-heavy"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
                <button className="rounded-sm hover:bg-[#2f2f2f] p-1 text-gray-400">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md-heavy"
                    >
                      <path
                        fill="currentColor"
                        d="M3.07 10.876C3.623 6.436 7.41 3 12 3a9.15 9.15 0 0 1 6.012 2.254V4a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H15a1 1 0 1 1 0-2h1.957A7.15 7.15 0 0 0 12 5a7 7 0 0 0-6.946 6.124 1 1 0 1 1-1.984-.248m16.992 1.132a1 1 0 0 1 .868 1.116C20.377 17.564 16.59 21 12 21a9.15 9.15 0 0 1-6-2.244V20a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H7.043A7.15 7.15 0 0 0 12 19a7 7 0 0 0 6.946-6.124 1 1 0 0 1 1.116-.868"
                      ></path>
                    </svg>
                  </span>
                </button>
                <button className="rounded-sm hover:bg-[#2f2f2f] p-1 text-gray-400">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="icon-md-heavy"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M11.873 21.496a1 1 0 0 1-.992.496l-.454-.056A4 4 0 0 1 7.1 16.79L7.65 15h-.718c-2.637 0-4.553-2.508-3.859-5.052l1.364-5A4 4 0 0 1 8.296 2h9.709a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-2c-.26 0-.5.14-.628.364zM14.005 4h-5.71a2 2 0 0 0-1.929 1.474l-1.363 5A2 2 0 0 0 6.933 13h2.072a1 1 0 0 1 .955 1.294l-.949 3.084a2 2 0 0 0 1.462 2.537l3.167-5.543a2.72 2.72 0 0 1 1.364-1.182V5a1 1 0 0 0-1-1m3 9V5c0-.35-.06-.687-.171-1h1.17a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className=" flex-1 w-full px-4 relative mb-16">
        <div className="w-full max-w-screen-md mx-auto relative flex flex-col pb-2 pt-6 ">
          {messages?.docs?.map((e) => {
            if (e?.data().user.id) {
              return (
                <div className="relative">
                  <OutputMessage
                    e={e}
                    promptOutput={promptOutput}
                    endRef={messagesEndRef}
                    model={e?.data().model}
                  />
                  <div className="absolute -bottom-4 mt-20" />
                </div>
              );
            } else {
              return <InputMessage e={e} />;
            }
          })}
        </div>
      </div>
      {!isInViewport && (
        <div className="sticky bottom-28 left-1/2 w-0 h-0 mx-auto z-40">
          <button
            onClick={scrollToBottom}
            className="absolute bottom-0 mx-auto p-1.5  ring-gray-400/70 ring-[.1px] text-xl rounded-full bg-[#212121]"
          >
            <MdOutlineArrowDownward />
          </button>
        </div>
      )}
      <div className="relative w-full h-1 bg-blue-400 z-[-100]">
        <div
          ref={messagesEndRef}
          className="absolute w-6 h-3 bg-red-600 left-1/2 top-14"
        ></div>
      </div>
    </>
  );
};

export default Chat;
