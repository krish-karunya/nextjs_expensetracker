import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const imageData = [
  {
    src: "/one.png",
    alt: "first-image",
  },
  {
    src: "/two.png",
    alt: "first-image",
  },
  {
    src: "/three.png",
    alt: "first-image",
  },
  {
    src: "/four.png",
    alt: "first-image",
  },
  {
    src: "/five.png",
    alt: "first-image",
  },
  {
    src: "/six.png",
    alt: "first-image",
  },
  {
    src: "/seven.png",
    alt: "first-image",
  },
  {
    src: "/eight.png",
    alt: "first-image",
  },
  {
    src: "/nine.png",
    alt: "first-image",
  },
  {
    src: "/ten.png",
    alt: "first-image",
  },
];

// Month Data :

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
