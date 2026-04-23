"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { NAV_SECTIONS, ROUTES } from "@/config";
import { cn } from "@/lib/cn";
import Image from "next/image";
import PandaIcon from "@/assets/svgs/panda-paw.svg";
import { Settings } from "lucide-react";
import { SettingsModal } from "@/components";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (href: string) => {
    const current = pendingHref ?? pathname;
    if (current === href) return true;
    if (href === ROUTES.DASHBOARD) return current === ROUTES.DASHBOARD;
    return current.startsWith(href);
  };

  const handleNavigate = (href: string) => {
    if (pathname === href) return;
    setPendingHref(href);
    router.push(href);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingHref(null);
  }, [pathname]);

  return (
    <>
      <aside className="flex h-screen w-[240px] flex-col justify-between border-r border-gray-100 bg-white px-[22px] py-5 shadow-[0px_16px_32px_0px_rgba(12,12,13,0.4)]">
        <div className="flex flex-col gap-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5 rounded-lg bg-white px-2.5 py-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-center rounded-lg bg-teal-100 p-1.5">
              <Image src={PandaIcon} alt="LinguaPanda" width={30} height={24} />
            </div>
            <div>
              <p className="font-serif text-base leading-tight text-gray-900">LinguaPanda</p>
              <p className="text-[10px] font-extralight text-gray-500">Learning with AI</p>
            </div>
          </div>

          {/* Nav sections */}
          <nav className="flex flex-col gap-5">
            {NAV_SECTIONS.map((section, si) => (
              <div key={si} className="flex flex-col gap-1">
                {section.label && (
                  <p className="mb-1 text-[10px] font-light tracking-wider text-slate-400">
                    {section.label}
                  </p>
                )}
                {section.items.map(({ label, href, icon: Icon }) => (
                  <button
                    key={href}
                    onClick={() => handleNavigate(href)}
                    className={cn(
                      "flex w-full items-center gap-[14px] rounded-lg px-[17px] py-2 text-[14px] transition-all",
                      isActive(href)
                        ? "bg-teal-50 font-medium text-[#0f4b42]"
                        : "bg-white/20 text-slate-500 hover:bg-gray-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive(href) ? "text-teal-700" : "text-slate-400"
                      )}
                    />
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Settings button — opens modal */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex w-full items-center gap-[14px] rounded-lg bg-white/20 px-[17px] py-2 text-[14px] text-slate-500 transition-all hover:bg-gray-50"
        >
          <Settings className="h-4 w-4 shrink-0 text-slate-400" />
          Setting
        </button>
      </aside>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
