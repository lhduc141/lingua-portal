import { ResponseDto } from './response-success-dto';

export type ResponsePagingDto<T> = ResponseDto<{
  rows: T[];
  count: number;
}>;
