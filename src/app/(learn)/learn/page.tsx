// (learn)/learn/page.tsx
import { redirect } from "next/navigation";
import { ROUTES } from "@/config";

export default function LearnPage() {
  redirect(ROUTES.LEARN.LESSONS);
}
