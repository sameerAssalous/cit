export enum UserRole {
  ADMINISTRATOR = "admin",
  PROJECT_MANAGER = "project_manager",
  EMPLOYEE = "employer",
}

export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  roles?: Role[];
  projectIds?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string | number;
  name: string;
  location: string;
  description: string;
  manager_id: string | number | null;
  manager?: User;
  issues?: Issue[];
}

export enum IssueStatus {
  OPEN = 1,
  IN_PROGRESS = 2,
  CLOSED = 4,
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  reporterId: string;
  reporterName: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  comments: Comment[];
  imageUrl?: string;
}

export interface ApiIssue {
  id: number;
  title: string;
  description: string;
  status: string | number;
  reporter_id: number;
  project_id: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  reported_by?: User;
  comments: Comment[];
  reporterName?: string;
  projectName?: string;
  projectId?: number;
  createdAt?: string;
  attachment?: string;
}

export interface Comment {
  id: number;
  issue_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    roles: Array<{
      id: number;
      name: string;
      permissions: Array<{
        id: number;
        name: string;
      }>;
    }>;
    created_at: string;
    updated_at: string;
  };
  comment: string;
  created_at: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  data: {
    user: User;
  };
}

export interface UsersResponse {
  data: User[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
