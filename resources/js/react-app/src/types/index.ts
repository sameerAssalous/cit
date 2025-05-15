
// Define user roles
export enum UserRole {
  EMPLOYEE = "employee",
  PROJECT_MANAGER = "project_manager",
  ADMINISTRATOR = "administrator",
}

// Define issue status
export enum IssueStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectIds?: string[]; // For project managers
  location?: string; // Added the location property
}

// Project interface
export interface Project {
  id: string;
  name: string;
  location: string;
  description?: string; // Added the description property
  managerIds: string[];
  createdAt?: Date; // Added the createdAt property
}

// Comment interface
export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Issue interface
export interface Issue {
  id: string;
  projectId: string;
  projectName: string;
  reporterId: string;
  reporterName: string;
  title: string;
  description: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  comments: Comment[];
}
