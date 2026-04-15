"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config";
import { usePracticeSessions } from "@/hooks/learn";
import { PawSpinner } from "@/components/shared/spinner";
import { LearnFilters, LearnPagination, PracticeCard } from "./_components";

const PAGE_SIZE = 9;

export default function PracticeSessionsPage() {
  const router = useRouter();
  const [skillFilter, setSkillFilter] = useState("");
  const [cefrFilter, setCefrFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(1);

  const { data, isLoading } = usePracticeSessions({
    skill: skillFilter || undefined,
    cefrLevel: cefrFilter || undefined,
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const handleFilterChange = (type: "skill" | "cefr", value: string) => {
    if (type === "skill") setSkillFilter(value);
    else setCefrFilter(value);
    setPageIndex(1);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif text-[30px] text-gray-900">Practice Sessions</h1>
        <p className="text-[16px] text-slate-500">
          Standalone practice sets to sharpen your skills
        </p>
      </div>

      <LearnFilters
        skillFilter={skillFilter}
        cefrFilter={cefrFilter}
        onSkillChange={(v) => handleFilterChange("skill", v)}
        onCefrChange={(v) => handleFilterChange("cefr", v)}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <PawSpinner />
        </div>
      ) : (data?.rows ?? []).length === 0 ? (
        <div className="py-16 text-center text-slate-400">No practice sessions found.</div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {(data?.rows ?? []).map((session) => (
            <PracticeCard
              key={session.questionSetId}
              session={session}
              onClick={() => router.push(ROUTES.LEARN.PRACTICE_SESSION(session.questionSetId))}
            />
          ))}
        </div>
      )}

      <LearnPagination
        pageIndex={pageIndex}
        totalCount={data?.count ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
