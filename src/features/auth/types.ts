export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Registration types
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  role: string;
}

// Login types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  role: string;
  token?: string;
}
