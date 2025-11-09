import axios from 'axios';
import { handleApiError, createApiError, getErrorMessage } from '../errorHandler';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
}

describe('errorHandler', () => {
  describe('handleApiError', () => {
    it('should handle Axios response error with message', () => {
      const error = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: {
            message: 'Invalid credentials',
          },
        },
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);

      const result = handleApiError(error as unknown);

      expect(result.message).toBe('Invalid credentials');
      expect(result.status).toBe(401);
      expect(result.statusText).toBe('Unauthorized');
    });

    it('should handle Axios response error with error field', () => {
      const error = {
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: {
            error: 'Validation failed',
          },
        },
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);

      const result = handleApiError(error as unknown);

      expect(result.message).toBe('Validation failed');
      expect(result.status).toBe(400);
    });

    it('should handle Axios response error without message', () => {
      const error = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: {},
        },
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);

      const result = handleApiError(error as unknown);

      expect(result.message).toBe('Request failed with status 500');
      expect(result.status).toBe(500);
    });

    it('should handle Axios response error with code', () => {
      const error = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: {
            message: 'Resource not found',
            code: 'RESOURCE_NOT_FOUND',
          },
        },
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);

      const result = handleApiError(error as unknown);

      expect(result.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('should handle network error (no response)', () => {
      const error = {
        request: {},
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);

      const result = handleApiError(error as unknown);

      expect(result.message).toBe('Network error: Please check your internet connection');
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.status).toBeUndefined();
    });

    it('should handle Error instance', () => {
      const error = new Error('Custom error message');

      mockedAxios.isAxiosError.mockReturnValue(false);

      const result = handleApiError(error);

      expect(result.message).toBe('Custom error message');
      expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should handle unknown error type', () => {
      const error = 'String error';

      mockedAxios.isAxiosError.mockReturnValue(false);

      const result = handleApiError(error);

      expect(result.message).toBe('An unexpected error occurred');
      expect(result.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('createApiError', () => {
    it('should create Error with message and status', () => {
      const apiError = {
        message: 'Test error',
        status: 400,
        statusText: 'Bad Request',
      };

      const error = createApiError(apiError);

      expect(error.message).toBe('Test error');
      expect((error as ErrorWithStatus).status).toBe(400);
    });

    it('should create Error with message and code', () => {
      const apiError = {
        message: 'Test error',
        code: 'TEST_ERROR',
      };

      const error = createApiError(apiError);

      expect(error.message).toBe('Test error');
      expect((error as ErrorWithStatus).code).toBe('TEST_ERROR');
    });

    it('should create Error with all fields', () => {
      const apiError = {
        message: 'Test error',
        status: 500,
        statusText: 'Internal Server Error',
        code: 'SERVER_ERROR',
      };

      const error = createApiError(apiError);

      expect(error.message).toBe('Test error');
      expect((error as ErrorWithStatus).status).toBe(500);
      expect((error as ErrorWithStatus).code).toBe('SERVER_ERROR');
    });
  });

  describe('getErrorMessage', () => {
    it('should return error message from Error instance', () => {
      const error = new Error('Test error message');
      const message = getErrorMessage(error);

      expect(message).toBe('Test error message');
    });

    it('should return default message for non-Error types', () => {
      const error = 'String error';
      const message = getErrorMessage(error);

      expect(message).toBe('An error occurred');
    });

    it('should return custom default message', () => {
      const error = 'String error';
      const message = getErrorMessage(error, 'Custom default');

      expect(message).toBe('Custom default');
    });
  });
});
