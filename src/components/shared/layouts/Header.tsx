"use client";

import { useAuthStore } from "@/stores";
import Image from "next/image";
import PandaIcon from "@/assets/svgs/panda-paw.svg";
import { Bell } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Header() {
  const { user } = useAuthStore();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <header className="flex h-auto items-center justify-between px-8 py-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-[32px] text-gray-900">
            {getGreeting()}, {firstName}
          </h1>
        </div>
        <p className="mt-1 text-[12px] font-medium text-slate-500">
          {formatDate()} — Let&apos;s crush your goal today
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex h-[57px] w-[57px] items-center justify-center rounded-xl bg-teal-50">
          <Bell className="h-5 w-5 text-teal-700" />
        </div>

        <div className="flex items-center gap-2.5 rounded-lg bg-white px-2.5 py-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <div>
            <p className="font-serif text-base leading-tight text-gray-900">
              {user?.displayName ?? "User"}
            </p>
            <p className="text-[10px] font-extralight text-gray-500">
              {user?.cefrLevel ? `${user.cefrLevel} Level` : "—"}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <Image src={PandaIcon} alt="avatar" width={28} height={22} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
