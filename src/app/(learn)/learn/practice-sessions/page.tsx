"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config";
import { usePracticeSessions } from "@/hooks/learn";
import { useAuthStore } from "@/stores";
import { PawSpinner } from "@/components/shared/spinner";
import { LearnFilters, LearnPagination, PracticeCard } from "./_components";
import { startPracticeExercise } from "@/services/learn";

const PAGE_SIZE = 30;

export default function PracticeSessionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [skillFilter, setSkillFilter] = useState("");
  const [cefrFilter, setCefrFilter] = useState("");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [startingId, setStartingId] = useState<string | null>(null);

  const { data, isLoading } = usePracticeSessions({
    skill: skillFilter || undefined,
    cefrLevel: cefrFilter || undefined,
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const handleStart = async (sessionId: string) => {
    if (startingId) return;
    setStartingId(sessionId);
    try {
      const res = await startPracticeExercise(sessionId);
      const id = res.data?.exerciseRecordId;
      sessionStorage.setItem(`exercise_${id}`, JSON.stringify(res.data));
      router.push(ROUTES.EXERCISE.DETAIL(id));
    } catch {
      setStartingId(null);
    }
  };

  const handleFilterChange = (type: "skill" | "cefr", value: string) => {
    if (type === "skill") setSkillFilter(value);
    else setCefrFilter(value);
    setPageIndex(1);
  };

  const rows = data?.rows ?? [];

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-5">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="font-serif text-[30px] text-gray-900">Practice</h1>
          <p className="text-[15px] text-slate-500">
            Standalone practice sets to sharpen your skills
          </p>
        </div>

        <LearnFilters
          skillFilter={skillFilter}
          cefrFilter={cefrFilter}
          search={search}
          onSkillChange={(v) => handleFilterChange("skill", v)}
          onCefrChange={(v) => handleFilterChange("cefr", v)}
          onSearchChange={setSearch}
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PawSpinner />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            {search ? `No sessions found for "${search}"` : "No practice sessions found."}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4 pb-16">
            {rows.map((session, idx) => (
              <PracticeCard
                key={session.questionSetId}
                session={session}
                index={idx}
                isStarting={startingId === session.questionSetId}
                onClick={() => void handleStart(session.questionSetId)}
              />
            ))}
          </div>
        )}
      </div>

      {(data?.count ?? 0) > PAGE_SIZE && (
        <div className="sticky bottom-0 flex justify-center py-3">
          <div className="flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-md">
            <LearnPagination
              pageIndex={pageIndex}
              totalCount={data?.count ?? 0}
              pageSize={PAGE_SIZE}
              onPageChange={setPageIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
}
