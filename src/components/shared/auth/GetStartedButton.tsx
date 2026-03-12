"use client";

import { RightArrowIcon } from "@/components/svg";
import { useRouter } from "next/navigation";

export default function GetStartedButton() {
  const router = useRouter();

  return (
    <button
      onClick={
        () => router.push("/login") // Move to /auth - login page
      }
      className={
        "flex items-center space-x-2 rounded-2xl bg-teal-600 px-8 py-3 font-sans font-bold"
      }
    >
      <div className={"text-white"}>Get started free</div>
      <RightArrowIcon />
    </button>
  );
}
