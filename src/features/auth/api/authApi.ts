import apiClient from '@shared/api/client';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  User,
} from '@features/auth/types';

const REGISTER_ENDPOINT = '/register';
const LOGIN_ENDPOINT = '/auth/login';
const LOGOUT_ENDPOINT = '/auth/logout';
const ME_ENDPOINT = '/me';

export const registerUser = async (credentials: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(REGISTER_ENDPOINT, credentials);
  return response.data;
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(LOGIN_ENDPOINT, credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await apiClient.post(LOGOUT_ENDPOINT, {});
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<{ data: User }>(ME_ENDPOINT);
  return response.data.data;
};
