
import { User, UserRole, Project, Issue, IssueStatus, Comment } from "../types";

// Sample users
export const USERS: User[] = [
  {
    id: "1",
    name: "John",
    email: "employee@example.com",
    role: UserRole.EMPLOYEE,
    location: "Site A"
  },
  {
    id: "2",
    name: "Mike",
    email: "manager@example.com",
    role: UserRole.PROJECT_MANAGER,
    projectIds: ["1", "2"],
    location: "Headquarters"
  },
  {
    id: "3",
    name: "Alice",
    email: "admin@example.com",
    role: UserRole.ADMINISTRATOR,
    location: "Main Office"
  },
];

// Sample projects
export const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Downtown High-rise Construction",
    location: "123 Main St, Downtown",
    managerIds: ["2", "3"],
    createdAt: new Date("2025-01-15")
  },
  {
    id: "2",
    name: "Highway Bridge Repair",
    location: "Interstate 95, Mile Marker 42",
    managerIds: ["2"],
    createdAt: new Date("2025-02-22")
  },
  {
    id: "3",
    name: "Shopping Mall Renovation",
    location: "Westfield Shopping Center",
    managerIds: ["3"],
    createdAt: new Date("2025-03-10")
  },
];

// Sample issues
export const ISSUES: Issue[] = [
  {
    id: "1",
    projectId: "1",
    projectName: "Downtown High-rise Construction",
    reporterId: "1",
    reporterName: "John ",
    title: "Concrete Quality Issue",
    description: "The concrete delivered today is showing signs of inconsistent mixing. Several batches appear to have inadequate cement content.",
    status: IssueStatus.OPEN,
    createdAt: "2025-05-07T09:30:00Z",
    updatedAt: "2025-05-07T09:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1584461977499-99901e8a0a30",
    comments: [
      {
        id: "101",
        issueId: "1",
        userId: "2",
        userName: "Mike ",
        content: "I'll contact the supplier immediately. Please segregate the affected batches.",
        createdAt: "2025-05-07T10:15:00Z",
      },
    ],
  },
  {
    id: "2",
    projectId: "1",
    projectName: "Downtown High-rise Construction",
    reporterId: "1",
    reporterName: "John ",
    title: "Missing Safety Equipment",
    description: "There are not enough safety harnesses for the team working on the 15th floor today.",
    status: IssueStatus.IN_PROGRESS,
    createdAt: "2025-05-06T08:45:00Z",
    updatedAt: "2025-05-07T11:20:00Z",
    comments: [
      {
        id: "102",
        issueId: "2",
        userId: "2",
        userName: "Mike",
        content: "Emergency order placed for additional harnesses. They should arrive within 2 hours.",
        createdAt: "2025-05-06T09:30:00Z",
      },
      {
        id: "103",
        issueId: "2",
        userId: "3",
        userName: "Alice",
        content: "I've authorized expedited shipping. The supplier confirmed they're on the way.",
        createdAt: "2025-05-06T10:45:00Z",
      },
    ],
  },
  {
    id: "3",
    projectId: "2",
    projectName: "Highway Bridge Repair",
    reporterId: "1",
    reporterName: "John",
    title: "Traffic Control Needed",
    description: "The temporary traffic barriers are insufficient for the increased holiday traffic. Need additional signage and barriers.",
    status: IssueStatus.CLOSED,
    createdAt: "2025-05-05T14:20:00Z",
    updatedAt: "2025-05-06T16:40:00Z",
    imageUrl: "https://images.unsplash.com/photo-1566996533071-2c578080c06e",
    comments: [
      {
        id: "104",
        issueId: "3",
        userId: "2",
        userName: "Mike",
        content: "Additional barriers and signs have been delivered and installed.",
        createdAt: "2025-05-06T16:30:00Z",
      },
    ],
  },
];

// Export a function to get filtered issues based on user role and projects
export const getFilteredIssues = (user: User | null): Issue[] => {
  if (!user) return [];
  
  switch (user.role) {
    case UserRole.ADMINISTRATOR:
      return [...ISSUES];
    case UserRole.PROJECT_MANAGER:
      return ISSUES.filter(issue => 
        user.projectIds?.includes(issue.projectId)
      );
    default:
      return [];
  }
};

// Get projects available for a specific user
export const getUserProjects = (user: User | null): Project[] => {
  if (!user) return [];
  
  switch (user.role) {
    case UserRole.ADMINISTRATOR:
      return [...PROJECTS];
    case UserRole.PROJECT_MANAGER:
      return PROJECTS.filter(project => 
        user.projectIds?.includes(project.id)
      );
    case UserRole.EMPLOYEE:
      return [...PROJECTS]; // Employees can see all projects for reporting
    default:
      return [];
  }
};
