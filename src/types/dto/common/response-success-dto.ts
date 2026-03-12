import { HTTP_STATUS } from "@/types";

export type ResponseDto<T> = {
  statusCode: HTTP_STATUS;
  message: string;
  data: T;
  errors: string[] | null;
};
