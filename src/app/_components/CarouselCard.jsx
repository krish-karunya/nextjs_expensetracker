"use client";

import React, { useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselCard = () => {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3, // 3 cards shown
      spacing: 16, //  space between them
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 1, //  show 1 card on small screens
          spacing: 8,
        },
      },
      "(max-width: 1024px)": {
        slides: {
          perView: 2, // how 2 cards on tablets
          spacing: 12,
        },
      },
    },
  });

  // Autoplay
  const timer = useRef(null);

  useEffect(() => {
    if (!slider) return;

    const interval = setInterval(() => {
      slider.current?.next();
    }, 2500); // 2.5s interval

    timer.current = interval;

    return () => clearInterval(interval);
  }, [slider]);

  const cards = ["Krishna", "Dharun", "Abith", "Mukesh", "Naveen"];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-20 flex justify-center items-center ">
      <div className="p-2 bg-indigo-200 rounded-full">
        <ChevronLeft />
      </div>
      <div ref={sliderRef} className="keen-slider flex">
        {cards.map((content, index) => (
          <div
            key={index}
            className="keen-slider__slide w-full flex-col justify-center items-center rounded-lg"
          >
            <div className="rounded-lg bg-indigo-100 flex-col justify-start gap-4 text-xl p-8">
              <div className="flex items-center gap-4 ">
                {" "}
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg"> {content}</p>
              </div>

              <div className="text-sm w-[200px] ml-12 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto,
                quod tempore numquam, accusamus necessitatibus impedit dolorem
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 bg-indigo-200 rounded-full">
        <ChevronRight />
      </div>
    </div>
  );
};

export default CarouselCard;
