import api from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    userId: BigInteger;
    nickName: string;
  };
}

export const authApi = {
  login: (data: LoginRequest) => 
    api.post<AuthResponse>('/auth/login', data),
  
  signup: (data: SignupRequest) => 
    api.post<AuthResponse>('/auth/signup', data),
}; 