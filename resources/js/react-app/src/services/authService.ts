
import apiClient from "./apiClient";
import { LoginResponse } from "../types";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", { 
    email, 
    password 
  });
  
  return response.data;
};

export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

export const logout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};


export const  getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): Boolean => {
  return !!localStorage.getItem('token');
};

export const getProfile = async  () : Promise<LoginResponse> => {
  try {
  const response = await apiClient.get<LoginResponse>("/auth/profile");
  
  return response.data;

  } catch (error) {
      throw error.response?.data || error.message;
  }
}