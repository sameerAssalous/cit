export enum UserRole {
  ADMINISTRATOR = "administrator",
  PROJECT_MANAGER = "project_manager",
  EMPLOYEE = "employee",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: [{ id: number; name: string }];
  projectIds?: string[];
}

export interface Project {
  id: string | number;
  name: string;
  location: string;
  description: string;
  manager_id: string | number | null;
  manager?: User;
}

export enum IssueStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
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
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}
