import React from "react";

const InputMessage = ({ e }) => {
  return (
    <div
      key={e?.data().user.name}
      className="w-full flex justify-end items-end mb-10"
    >
      <span className="w-fit max-w-[90%] md:max-w-[75%] py-2.5 px-4 bg-[#2f2f2f] rounded-[40px] font-light text-[.95rem]">
        {e.data().text}
      </span>
    </div>
  );
};

export default InputMessage;
