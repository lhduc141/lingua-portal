"use client";

import Image from "next/image";
import { cn } from "@/lib";
import type { User } from "@/types";
import { CEFR_DESCRIPTIONS, CEFR_LABELS } from "@/types/constants/cefr-level.constant";

const CEFR_BADGE: Record<string, string> = {
  A1: "bg-gray-100 text-gray-600",
  A2: "bg-green-50 text-green-700",
  B1: "bg-teal-50 text-teal-700",
  B2: "bg-blue-50 text-blue-700",
  C1: "bg-purple-50 text-purple-700",
};

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const level = user.cefrLevel ?? "—";
  const label = user.cefrLevel ? CEFR_LABELS[user.cefrLevel] : "Not assessed";
  const description = user.cefrLevel
    ? CEFR_DESCRIPTIONS[user.cefrLevel]
    : "Complete the placement test to get your CEFR level.";
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-start gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Avatar */}
      <div className="shrink-0">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.displayName}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-[28px] font-bold text-teal-700">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-[28px] text-gray-900">{user.displayName}</h2>
          {user.cefrLevel && (
            <span
              className={cn(
                "rounded-lg px-3 py-1 text-[13px] font-bold",
                CEFR_BADGE[user.cefrLevel] ?? "bg-gray-100 text-gray-600"
              )}
            >
              {level}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[14px] text-slate-500">{user.email}</p>
        <p className="mt-1 text-[13px] font-semibold text-teal-700">{label}</p>
        <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-slate-500">{description}</p>
        <p className="mt-2 text-[12px] text-slate-400">Member since {memberSince}</p>
      </div>
    </div>
  );
}