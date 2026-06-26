import axios from 'axios';
import { ApiErrorResponse } from './types';

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const message = data?.errors || error.message || 'An unexpected error occurred';
    throw new ApiError(message, error.response?.status);
  }
  
  if (error instanceof Error) {
    throw new ApiError(error.message);
  }
  
  throw new ApiError('An unexpected error occurred');
};
