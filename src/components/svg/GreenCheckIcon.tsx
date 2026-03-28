import { cn } from "@/lib";
import { SVGProps } from "react";

export function GreenCheckIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(className, className)}
      {...props}
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.1667 2.5L10.8333 20.8333L2.5 12.5"
        stroke="#188C7D"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
