
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
