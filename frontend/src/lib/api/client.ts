import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants';
import type { ApiErrorCode, ApiFailure } from '@/types/api';

export class ApiClientError extends Error implements ApiFailure {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(failure: ApiFailure) {
    super(failure.message);
    this.name = 'ApiClientError';
    this.code = failure.code;
    this.status = failure.status;
  }
}

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured && configured.length > 0) {
    return configured.replace(/\/$/, '');
  }
  return '';
}

export const http: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: REQUEST_TIMEOUT_MS.default,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function toApiFailure(error: unknown): ApiFailure {
  if (error instanceof ApiClientError) {
    return {
      code: error.code,
      status: error.status,
      message: error.message,
    };
  }

  if (axios.isAxiosError(error)) {
    return fromAxiosError(error);
  }

  if (error instanceof Error) {
    return { code: 'unknown', message: error.message };
  }

  return { code: 'unknown', message: 'An unexpected error occurred.' };
}

function fromAxiosError(error: AxiosError): ApiFailure {
  if (error.code === 'ECONNABORTED') {
    return {
      code: 'timeout',
      message: 'The request timed out. The service did not respond in time.',
    };
  }

  if (!error.response) {
    return {
      code: 'network',
      message: 'Unable to reach the clinical API. Check the connection and try again.',
    };
  }

  const status = error.response.status;
  const data = error.response.data;
  const detail = extractDetail(data);

  if (status >= 500) {
    return {
      code: 'http',
      status,
      message: detail ?? 'The clinical service encountered an internal error.',
    };
  }

  if (status >= 400) {
    return {
      code: 'http',
      status,
      message: detail ?? 'The request could not be processed.',
    };
  }

  return {
    code: 'http',
    status,
    message: detail ?? 'The request failed.',
  };
}

function extractDetail(data: unknown): string | null {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data;
  }
  if (typeof data === 'object' && data !== null) {
    if ('detail' in data && typeof data.detail === 'string') {
      return data.detail;
    }
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }
  return null;
}

export function throwIfApiError(error: unknown): never {
  const failure = toApiFailure(error);
  throw new ApiClientError(failure);
}
