export default function LessonDetailPage({ params }: { params: { lessonId: string } }) {
  return (
    <div className="flex h-full items-center justify-center text-slate-400">
      Lesson detail — coming soon {`$params`}
    </div>
  );
}
