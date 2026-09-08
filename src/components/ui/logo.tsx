import React from "react";
import { cn } from "@/lib/utils";

export const LogoP = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("w-full h-full", className)}
    >
      <path
        d="M25 15 H75 C97.0914 15 115 32.9086 115 55 C115 77.0914 97.0914 95 75 95 H45 V115 H25 V15 Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M45 35 H75 C86.0457 35 95 43.9543 95 55 C95 66.0457 86.0457 75 75 75 H45 V35 Z"
        fill="currentColor"
        className="text-white dark:text-navy-950"
      />
      <path
        d="M25 15 L45 35 V75 L25 95 V15 Z"
        fill="white"
        opacity="0.2"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="25" y1="15" x2="115" y2="115" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
      </defs>
    </svg>
  );
};
