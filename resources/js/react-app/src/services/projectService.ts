
import apiClient from "./apiClient";
import { Project } from "@/types";

interface ProjectResponse {
  data: Project[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

interface ProjectQueryParams {
  search_term?: string;
  manager_id?: string | number;
  date_from?: string;
  date_to?: string;
  page?: number;
}

// Get all projects with optional filtering
export const getProjects = async (params?: ProjectQueryParams): Promise<ProjectResponse> => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await apiClient.get(`/projects${queryString}`);
  return response.data;
};

// Get a single project by ID
export const fetchProject = async (id: string | number): Promise<Project> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

// Create a new project
export const createProject = async (projectData: any): Promise<Project> => {
  const response = await apiClient.post('/projects', projectData);
  return response.data;
};

// Update an existing project
export const updateProject = async (id: string | number, projectData: any): Promise<Project> => {
  const response = await apiClient.patch(`/projects/${id}`, projectData);
  return response.data;
};

// Delete a project
export const deleteProject = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

// Export project as PDF
export const exportProjectPdf = async (id: string | number): Promise<Blob> => {
  const response = await apiClient.post(`/projects/${id}/export`, {}, { responseType: 'blob' });
  return response.data;
};
