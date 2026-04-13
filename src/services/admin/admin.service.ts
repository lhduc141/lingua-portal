import { api } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AdminPlacementSessionDto,
  AdminStatsDto,
  AdminUsersResponseDto,
} from "@/types/dto/admin";
import type { ResponseDto, ResponsePagingDto } from "@/types";

export async function getAdminStats(): Promise<ResponseDto<AdminStatsDto>> {
  return api.get(ENDPOINTS.ADMIN.STATS);
}

export async function getAdminUsers(params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ResponseDto<AdminUsersResponseDto>> {
  return api.get(ENDPOINTS.ADMIN.USERS, { params });
}

export async function getAdminPlacementSessions(params?: {
  pageIndex?: number;
  pageSize?: number;
  cefrLevel?: string;
  status?: string;
}): Promise<ResponsePagingDto<AdminPlacementSessionDto>> {
  return api.get<unknown, ResponsePagingDto<AdminPlacementSessionDto>>(
    ENDPOINTS.ADMIN.PLACEMENT_SESSIONS,
    { params }
  );
}

export async function updateLessonStatus(
  lessonId: string,
  status: "published" | "draft"
): Promise<ResponseDto<{ lessonId: string; title: string; status: string }>> {
  return api.patch(ENDPOINTS.ADMIN.UPDATE_LESSON_STATUS(lessonId), { status });
}
