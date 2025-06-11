import apiClient from "./apiClient";
import { ApiIssue } from "@/types";

interface IssueResponse {
  data: ApiIssue[];
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

interface IssueQueryParams {
  search_term?: string;
  status?: string | number;
  project_id?: string | number;
  date_from?: string;
  date_to?: string;
  page?: number;
}

// Get all issues with optional filtering
export const getIssues = async (params?: IssueQueryParams): Promise<IssueResponse> => {
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
  const response = await apiClient.get(`/issues${queryString}`);
  return response.data;
};

// Get a single issue by ID
export const getIssue = async (id: string | number): Promise<ApiIssue> => {
  const response = await apiClient.get(`/issues/${id}`);
  return response.data;
};

// Create a new issue
export const createIssue = async (issueData: any): Promise<ApiIssue> => {
  const config = {
    headers: {
      'Content-Type': issueData instanceof FormData ? undefined : 'application/json',
    },
  };
  const response = await apiClient.post('/issues', issueData, config);
  return response.data;
};

// Update an issue
export const updateIssue = async (id: string | number, issueData: any): Promise<ApiIssue> => {
  const response = await apiClient.patch(`/issues/${id}`, issueData);
  return response.data;
};

// Delete an issue
export const deleteIssue = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/issues/${id}`);
};

// Update issue status
export const updateIssueStatus = async (id: string | number, status: string | number): Promise<ApiIssue> => {
  const response = await apiClient.post(`/issues/${id}/status`, { status });
  return response.data;
};

// Add comment to an issue
export const addIssueComment = async (id: string | number, comment: string): Promise<ApiIssue> => {
  const response = await apiClient.post(`/issues/${id}/comment`, { comment });
  return response.data;
};

// Export issue as PDF
export const exportIssuePdf = async (id: string | number): Promise<Blob> => {
  const response = await apiClient.post(`/issues/${id}/export`, {}, { responseType: 'blob' });
  return response.data;
};
