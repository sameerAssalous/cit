
import apiClient from "./apiClient";
import { User, UsersResponse, CreateUserRequest } from "../types";

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await apiClient.get<UsersResponse>("/users");
  return response.data;
};

export const getUser = async (id: string | number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post<User>("/users", userData);
  return response.data;
};

export const updateUser = async (id: string | number, userData: Partial<CreateUserRequest>): Promise<User> => {
  const response = await apiClient.patch<User>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
