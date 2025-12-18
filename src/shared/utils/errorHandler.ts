import axios from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  code?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${status}`;

      return {
        message,
        status,
        statusText,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      return {
        message: 'Network error: Please check your internet connection',
        code: 'NETWORK_ERROR',
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const createApiError = (apiError: ApiError): Error => {
  const error = new Error(apiError.message);
  if (apiError.status) {
    (error as Error & { status?: number }).status = apiError.status;
  }
  if (apiError.code) {
    (error as Error & { code?: string }).code = apiError.code;
  }
  return error;
};

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = 'An error occurred'
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
