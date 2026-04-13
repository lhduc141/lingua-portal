"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useAdminUsers } from "@/hooks/admin";
import { PawSpinner } from "@/components";
import { UsersTable } from "./_components/UsersTable";

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    limit: PAGE_SIZE,
    offset,
  });
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  if (isLoading) return <PawSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[32px] text-gray-900">Users</h1>
        <p className="mt-1 text-[14px] text-slate-500">{total} registered users</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          placeholder="Search by name or email..."
          className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-[14px] outline-none focus:border-teal-400"
        />
      </div>

      <UsersTable users={users} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px]">
          <p className="text-slate-400">
            Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((p) => Math.max(0, p - PAGE_SIZE))}
              disabled={offset === 0}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="flex items-center px-3 text-slate-500">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setOffset((p) => p + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= total}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
