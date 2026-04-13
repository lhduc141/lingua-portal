"use client";
import Image from "next/image";
import { cn } from "@/lib";
import type { AdminUserDto } from "@/types/dto/admin";

const CEFR_BADGE: Record<string, string> = {
  A1: "bg-gray-100 text-gray-600",
  A2: "bg-green-50 text-green-700",
  B1: "bg-teal-50 text-teal-700",
  B2: "bg-blue-50 text-blue-700",
  C1: "bg-purple-50 text-purple-700",
};

interface UsersTableProps {
  users: AdminUserDto[];
}

export function UsersTable({ users }: UsersTableProps) {
  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            {["User", "Email", "Level", "Status", "Joined", "Last Active"].map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.userId} className="transition-colors hover:bg-gray-50">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  {user.googleAvatarUrl ? (
                    <Image
                      src={user.googleAvatarUrl}
                      alt={user.googleName ?? ""}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-[12px] font-bold text-teal-700">
                      {(user.googleName ?? user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">
                      {user.googleName ?? "—"}
                    </p>
                    {user.isAdmin && (
                      <span className="text-[10px] font-bold text-red-500">ADMIN</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-[13px] text-slate-500">{user.email}</td>
              <td className="px-5 py-3">
                {user.cefrLevel ? (
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[11px] font-bold",
                      CEFR_BADGE[user.cefrLevel] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {user.cefrLevel}
                  </span>
                ) : (
                  <span className="text-[12px] text-slate-300">—</span>
                )}
              </td>
              <td className="px-5 py-3">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
                  )}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-3 text-[13px] text-slate-500">{formatDate(user.createdAt)}</td>
              <td className="px-5 py-3 text-[13px] text-slate-500">
                {formatDate(user.lastLoginAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="py-12 text-center text-[14px] text-slate-400">No users found</div>
      )}
    </div>
  );
}
