import { ApiPaginationPayload } from './api-pagination-payload';
import { ApiResponseStatus } from './api-response-status';

export interface ApiPaginationResponse {
  message: ApiResponseStatus;
  total_records: number;
  total_pages: number;
  previous: string;
  next: string;
  results: ApiPaginationPayload[];
}
