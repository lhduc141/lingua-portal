"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { ROUTES } from "@/config";
import { Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!user.isAdmin) {
      router.replace(ROUTES.DASHBOARD);
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-[20px] text-gray-900">LinguaPanda Admin</span>
          </div>
          <div className="flex items-center gap-6 text-[13px]">
            <a href={ROUTES.ADMIN.ROOT} className="font-medium text-gray-700 hover:text-teal-600">
              Overview
            </a>
            <a href={ROUTES.ADMIN.USERS} className="font-medium text-gray-700 hover:text-teal-600">
              Users
            </a>
            <a
              href={ROUTES.ADMIN.PLACEMENT}
              className="font-medium text-gray-700 hover:text-teal-600"
            >
              Placement
            </a>
            <a href={ROUTES.DASHBOARD} className="text-slate-400 hover:text-gray-600">
              ← Back to App
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
    </div>
  );
}
