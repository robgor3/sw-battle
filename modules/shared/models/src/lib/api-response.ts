import { ApiResponseStatus } from './api-response-status';

export interface ApiResponse<T = unknown> {
  message: ApiResponseStatus;
  result: {
    properties: T;
    description: string;
    _id: string;
    uid: string;
    __v: number;
  };
}
