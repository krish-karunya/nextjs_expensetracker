"use client";

import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { CircleOff } from "lucide-react";

const EmojiInput = ({ emoji, setEmoji }) => {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const handleEmoji = (data) => {
    // console.log(data);

    setEmoji(data.emoji);
    setIsImagePickerOpen(false);
    // console.log(emoji);
  };
  return (
    <div>
      <div className="border border-gray-500 rounded-lg h-40 w-full">
        {isImagePickerOpen && (
          <div className="absolute top-16 right-10">
            <EmojiPicker onEmojiClick={handleEmoji} size={50} />
          </div>
        )}
        <button
          className="w-full bg-gray-200 h-full flex justify-center items-center rounded-lg "
          onClick={() => setIsImagePickerOpen(!isImagePickerOpen)}
        >
          <div className="flex flex-col justify-center items-center">
            {!emoji ? <CircleOff /> : <div className="text-5xl">{emoji}</div>}
            <p className="text-sm text-gray-400 font-semibold mt-4">
              Click to select Emoji
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EmojiInput;
