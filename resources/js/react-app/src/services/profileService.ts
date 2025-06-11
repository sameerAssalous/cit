
import apiClient from "./apiClient";
import { ProfileResponse } from "../types";

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>("/auth/user");
  return response.data;
};
