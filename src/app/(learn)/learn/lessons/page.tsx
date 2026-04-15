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

const PAGE_SIZE = 20;

export default function LessonsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [skillFilter, setSkillFilter] = useState("");
  const [cefrFilter, setCefrFilter] = useState(user?.cefrLevel ?? "");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [planOnly, setPlanOnly] = useState(false);

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

  // ── In-plan lesson IDs ──────────────────────────────────────
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
    return planOnly ? allRows.filter((l) => inPlanLessonIds.has(l.lessonId)) : (data?.rows ?? []);
  }, [planOnly, allRows, data?.rows, inPlanLessonIds]);

  const total = planOnly ? gridRows.length : (data?.count ?? 0);

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
    setPageIndex(1);
  };

  // When planOnly, paginate client-side
  const paginatedRows = planOnly
    ? gridRows.slice((pageIndex - 1) * PAGE_SIZE, pageIndex * PAGE_SIZE)
    : gridRows;

  return (
    // flex-col h-full so pagination sticks to bottom of (learn) scroll container
    <div className="flex min-h-full flex-col">
      {/* ── Scrollable content ── */}
      <div className="flex-1 space-y-5">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="font-serif text-[30px] text-gray-900">Lessons</h1>
          <p className="text-[15px] text-slate-500">
            Structured lessons with theory and practice questions
          </p>
        </div>

        {/* Filters */}
        <LearnFilters
          skillFilter={skillFilter}
          cefrFilter={cefrFilter}
          search={search}
          planOnly={planOnly}
          onSkillChange={(v) => handleFilterChange("skill", v)}
          onCefrChange={(v) => handleFilterChange("cefr", v)}
          onSearchChange={handleSearchChange}
          onPlanOnlyToggle={handlePlanOnlyToggle}
        />

        {/* Stats */}
        {!isLoading && (data?.count ?? 0) > 0 && (
          <LearnStatsBar
            total={planOnly ? inPlanCount : (data?.count ?? 0)}
            completed={completedCount}
            inPlan={inPlanCount}
          />
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <PawSpinner />
          </div>
        ) : paginatedRows.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            {planOnly
              ? "No lessons in your plan yet. Generate a plan first."
              : search
                ? `No lessons found for "${search}"`
                : "No lessons found."}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 pb-4">
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

      {/* ── Sticky pagination ── */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-[#f8fbfd] py-3">
        <LearnPagination
          pageIndex={pageIndex}
          totalCount={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPageIndex}
        />
      </div>
    </div>
  );
}
