"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <section className="w-full relative bg-white text-[#1b1b1b] min-h-screen">
      <div className="max-w-xs mx-auto py-6 flex flex-col items-center gap-40">
        <div className="">
          <Image src={"/logo.png"} width={32} height={32} alt="ChatGPT" />
        </div>
        <div className="flex flex-col gap-4 w-full items-center">
          <h2 className="text-3xl font-bold opacity-90">Welocme back</h2>

          <label
            htmlFor="Username"
            className="relative w-full block rounded-md border border-gray-200 shadow-sm focus-within:border-[#10a37f] focus-within:ring-1 focus-within:ring-[#10a37f]"
          >
            <input
              type="email"
              id="LOGIN_EMAIL"
              className="w-full px-4 py-3.5 peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Email Address*"
            />

            <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#10a37f]">
              Email Addresss*
            </span>
          </label>
          <button className="w-full flex items-center justify-center py-3.5 bg-[#10a37f] hover:bg-[#158b6e] text-white tracking-tight rounded-sm">
            Continue
          </button>
          <div className="w-fit text-sm tracking-tight flex gap-2">
            <span>Don't have an account? </span>
            <Link href={"/"} className="text-[#10a37f]">
              Sign Up
            </Link>
          </div>
          <div className="w-full text-center relative flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute top-1/2 -translate-y-1/2 w-full h-px bg-neutral-400 left-0"></span>
            </div>
            <div className="px-1 z-10  text-neutral-600 text-[.925rem]">OR</div>
            <div className="flex-1 relative">
              <span className="absolute top-1/2 -translate-y-1/2 w-full h-px bg-neutral-400 left-0"></span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              signIn("google");
            }}
            className="w-full rounded-sm border border-gray-300 p-3 flex gap-3 items-center text-[.95rem] font-[400] text-neutral-800 hover:bg-gray-100"
          >
            <Image src={"/google.png"} width={24} height={24} alt="Google" />
            <span>Continue with Google</span>
          </button>
          <button className="w-full -mt-2 rounded-sm border border-gray-300 p-3 flex gap-3 items-center text-[.95rem] font-[400] text-neutral-800 hover:bg-gray-100">
            <Image src={"/microsoft.png"} width={24} height={24} alt="Google" />
            <span>Continue with Microsoft</span>
          </button>
          <button className="w-full -mt-2 rounded-sm border border-gray-300 p-3 flex gap-3 items-center text-[.95rem] font-[400] text-neutral-800 hover:bg-gray-100">
            <Image src={"/apple.png"} width={24} height={24} alt="Google" />
            <span>Continue with Apple</span>
          </button>
        </div>
        <div className="flex gap-2 relative items-center text-sm text-[#10a37f]">
          <Link href={"/"}>Terms of Use</Link>
          <div className="h-4 w-px bg-gray-500"></div>
          <Link href={"/"}>Privacy Policy</Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
