"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config";
import { useLessons } from "@/hooks/learn";
import { useCurrentPlan } from "@/hooks/plan";
import { useAuthStore } from "@/stores";
import { PawSpinner } from "@/components/shared/spinner";
import { LearnFilters, LearnPagination, LearnStatsBar, LessonCard } from "./_components";
import type { PlanTaskDto } from "@/types/dto/plan";

const PAGE_SIZE = 30;

export default function LessonsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [skillFilter, setSkillFilter] = useState("");
  const [cefrFilter, setCefrFilter] = useState(user?.cefrLevel ?? "");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [planOnly, setPlanOnly] = useState(false);
  const [completedOnly, setCompletedOnly] = useState(false); // ← THÊM

  const { data, isLoading } = useLessons({
    skill: skillFilter || undefined,
    cefrLevel: cefrFilter || undefined,
    keyword: search.trim() || undefined,
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const { data: statsData } = useLessons({
    skill: skillFilter || undefined,
    cefrLevel: cefrFilter || undefined,
    keyword: search.trim() || undefined,
    pageIndex: 1,
    pageSize: 9999,
  });

  const { data: planData } = useCurrentPlan();
  const inPlanLessonIds = useMemo<Set<string>>(() => {
    if (!planData?.days) return new Set();
    const ids = planData.days
      .flatMap((d: { tasks?: PlanTaskDto[] }) => d.tasks ?? [])
      .filter((t: PlanTaskDto) => t.refType === "lesson" && t.refId)
      .map((t: PlanTaskDto) => t.refId as string);
    return new Set(ids);
  }, [planData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allRows = statsData?.rows ?? [];
  const completedCount = allRows.filter((l) => l.userProgress?.isCompleted).length;
  const inPlanCount = allRows.filter((l) => inPlanLessonIds.has(l.lessonId)).length;

  const gridRows = useMemo(() => {
    let rows = planOnly
      ? allRows.filter((l) => inPlanLessonIds.has(l.lessonId))
      : (data?.rows ?? []);
    if (completedOnly) rows = rows.filter((l) => l.userProgress?.isCompleted); // ← THÊM
    return rows;
  }, [planOnly, completedOnly, allRows, data?.rows, inPlanLessonIds]);

  const total = planOnly || completedOnly ? gridRows.length : (data?.count ?? 0);

  const handleFilterChange = (type: "skill" | "cefr", value: string) => {
    if (type === "skill") setSkillFilter(value);
    else setCefrFilter(value);
    setSearch("");
    setPlanOnly(false);
    setPageIndex(1);
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPlanOnly(false);
    setPageIndex(1);
  };

  const handlePlanOnlyToggle = () => {
    setPlanOnly((prev) => !prev);
    setCompletedOnly(false); // ← mutual exclusive
    setPageIndex(1);
  };

  const handleCompletedOnlyToggle = () => {
    setCompletedOnly((prev) => !prev);
    setPlanOnly(false); // ← mutual exclusive
    setPageIndex(1);
  };

  const paginatedRows =
    planOnly || completedOnly
      ? gridRows.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE)
      : gridRows;

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-5">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="font-serif text-[30px] text-gray-900">Lessons</h1>
          <p className="text-[15px] text-slate-500">
            Structured lessons with theory and practice questions
          </p>
        </div>

        <LearnFilters
          skillFilter={skillFilter}
          cefrFilter={cefrFilter}
          search={search}
          planOnly={planOnly}
          completedOnly={completedOnly}
          onSkillChange={(v) => handleFilterChange("skill", v)}
          onCefrChange={(v) => handleFilterChange("cefr", v)}
          onSearchChange={handleSearchChange}
          onPlanOnlyToggle={handlePlanOnlyToggle}
          onCompletedOnlyToggle={handleCompletedOnlyToggle}
        />

        {!isLoading && (data?.count ?? 0) > 0 && (
          <LearnStatsBar
            total={planOnly ? inPlanCount : (data?.count ?? 0)}
            completed={completedCount}
            inPlan={inPlanCount}
          />
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PawSpinner />
          </div>
        ) : paginatedRows.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            {completedOnly
              ? "No completed lessons yet."
              : planOnly
                ? "No lessons in your plan yet. Generate a plan first."
                : search
                  ? `No lessons found for "${search}"`
                  : "No lessons found."}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4 pb-4">
            {" "}
            {paginatedRows.map((lesson, idx) => (
              <LessonCard
                key={lesson.lessonId}
                lesson={lesson}
                index={idx}
                isInPlan={inPlanLessonIds.has(lesson.lessonId)}
                onClick={() => router.push(ROUTES.LEARN.LESSON(lesson.lessonId))}
              />
            ))}
          </div>
        )}
      </div>

      {total > PAGE_SIZE && (
        <div className="sticky bottom-0 flex justify-center py-3">
          <div className="flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-md">
            <LearnPagination
              pageIndex={pageIndex}
              totalCount={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPageIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
}
