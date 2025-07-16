"use client";
import { useState } from "react";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen && (
        <div
          className="h-full bg-black opacity-20 absolute right-0 left-0 z-100"
          onClick={() => setIsOpen(false)}
        />
      )}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
      // className={`${isOpen} && "h-full bg-black opacity-20 absolute right-0 left-0 " `}
      >
        <Hero isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}
