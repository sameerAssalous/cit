
// Import necessary types
import { User, Project, Issue, IssueStatus, UserRole, Comment } from "@/types";

// Mock Users Data
export const USERS: User[] = [
  {
    id: "1",
    name: "John Administrator",
    email: "john@example.com",
    role: UserRole.ADMINISTRATOR,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah@example.com",
    role: UserRole.PROJECT_MANAGER,
    projectIds: ["1", "2"],
    created_at: "2025-01-02T00:00:00.000Z",
    updated_at: "2025-01-02T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Mike Employee",
    email: "mike@example.com",
    role: UserRole.EMPLOYEE,
    created_at: "2025-01-03T00:00:00.000Z",
    updated_at: "2025-01-03T00:00:00.000Z"
  }
];

// Mock Projects Data
export const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Office Building Renovation",
    description: "Complete renovation of the downtown office building.",
    location: "Downtown",
    managerIds: ["2"],
    created_at: "2025-01-10T00:00:00.000Z",
    updated_at: "2025-01-10T00:00:00.000Z"
  },
  {
    id: "2",
    name: "Shopping Mall Construction",
    description: "New shopping mall construction in the west side.",
    location: "West Side",
    managerIds: ["2"],
    created_at: "2025-02-15T00:00:00.000Z",
    updated_at: "2025-02-15T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Apartment Complex",
    description: "Luxury apartment complex with 200 units.",
    location: "North Hills",
    managerIds: ["2"],
    created_at: "2025-03-20T00:00:00.000Z",
    updated_at: "2025-03-20T00:00:00.000Z"
  }
];

// Mock Comments
export const COMMENTS: Comment[] = [
  {
    id: "1",
    issueId: "1",
    userId: "1",
    userName: "John Administrator",
    content: "This needs immediate attention.",
    createdAt: "2025-02-01T10:00:00.000Z"
  },
  {
    id: "2",
    issueId: "1",
    userId: "2",
    userName: "Sarah Manager",
    content: "I've assigned a team to fix this.",
    createdAt: "2025-02-01T11:30:00.000Z"
  },
  {
    id: "3",
    issueId: "2",
    userId: "3",
    userName: "Mike Employee",
    content: "Found additional issues with the electrical wiring.",
    createdAt: "2025-02-05T09:15:00.000Z"
  }
];

// Mock Issues
export const ISSUES: Issue[] = [
  {
    id: "1",
    projectId: "1",
    projectName: "Office Building Renovation",
    reporterId: "3",
    reporterName: "Mike Employee",
    title: "Water Damage in East Wing",
    description: "Significant water damage found in the east wing ceiling, potentially from a leaking pipe above.",
    status: IssueStatus.OPEN,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
    comments: COMMENTS.filter(comment => comment.issueId === "1"),
    dueDate: "2025-01-30T00:00:00.000Z"
  },
  {
    id: "2",
    projectId: "1",
    projectName: "Office Building Renovation",
    reporterId: "2",
    reporterName: "Sarah Manager",
    title: "Electrical Issues in Conference Room",
    description: "Power outlets in the main conference room are not functioning properly.",
    status: IssueStatus.IN_PROGRESS,
    createdAt: "2025-01-20T00:00:00.000Z",
    updatedAt: "2025-01-25T00:00:00.000Z",
    comments: COMMENTS.filter(comment => comment.issueId === "2"),
    dueDate: "2025-02-05T00:00:00.000Z"
  },
  {
    id: "3",
    projectId: "2",
    projectName: "Shopping Mall Construction",
    reporterId: "3",
    reporterName: "Mike Employee",
    title: "Foundation Cracks",
    description: "Small cracks observed in the south entrance foundation.",
    status: IssueStatus.CLOSED,
    createdAt: "2025-02-20T00:00:00.000Z",
    updatedAt: "2025-03-05T00:00:00.000Z",
    comments: [],
    dueDate: "2025-02-28T00:00:00.000Z"
  }
];
