"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = ({ isOpen, setIsOpen }) => {
  return (
    <div className="flex items-center justify-between p-5 bg-indigo-100 shadow-lg">
      <div className="font-bold text-gray-600">
        <p className="bg-gradient-to-r border-indigo-800  to-violet-800 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent flex items-center gap-2">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide  lucide-piggy-bank stroke  stroke-indigo-700 stroke-[1.5] "
            animate={{ y: [0, -5, 0] }} // Bounce: up and down
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
            <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
            <path d="M16 11h0"></path>
          </motion.svg>
          <span className="hidden md:block"> BudgetTracker</span>
        </p>
      </div>
      <div
        className="flex items-center gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Button className="bg-indigo-600 hover:bg-indigo-800">Sign up</Button>

        <Button variant={"outline"}>Login</Button>
      </div>
    </div>
  );
};

export default Header;
