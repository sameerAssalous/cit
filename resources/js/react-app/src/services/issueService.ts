
import { Issue, IssueStatus, Comment, User, UserRole } from "../types";
import { ISSUES, PROJECTS } from "./mockData";

// Function to simulate adding a new issue
export const addIssue = (
  title: string,
  description: string,
  projectId: string,
  reporterId: string,
  reporterName: string,
  imageUrl?: string
): Promise<Issue> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = PROJECTS.find(p => p.id === projectId);
      
      // Create new issue
      const newIssue: Issue = {
        id: `${ISSUES.length + 1}`,
        projectId,
        projectName: project?.name || "Unknown Project",
        reporterId,
        reporterName,
        title,
        description,
        status: IssueStatus.OPEN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl,
        comments: []
      };
      
      // Add to mock database
      ISSUES.unshift(newIssue);
      
      resolve(newIssue);
    }, 500);
  });
};

// Function to update issue status
export const updateIssueStatus = (
  issueId: string,
  status: IssueStatus,
  userId: string
): Promise<Issue> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const issueIndex = ISSUES.findIndex(issue => issue.id === issueId);
      
      if (issueIndex === -1) {
        reject(new Error("Issue not found"));
        return;
      }
      
      // Update issue status
      ISSUES[issueIndex] = {
        ...ISSUES[issueIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      resolve(ISSUES[issueIndex]);
    }, 500);
  });
};

// Function to add a comment to an issue
export const addComment = (
  issueId: string,
  userId: string,
  userName: string,
  content: string
): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const issueIndex = ISSUES.findIndex(issue => issue.id === issueId);
      
      if (issueIndex === -1) {
        reject(new Error("Issue not found"));
        return;
      }
      
      // Create new comment
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        issueId,
        userId,
        userName,
        content,
        createdAt: new Date().toISOString()
      };
      
      // Add comment to issue
      ISSUES[issueIndex].comments.push(newComment);
      
      resolve(newComment);
    }, 500);
  });
};

// Function to get issue details
export const getIssueById = (issueId: string): Promise<Issue | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const issue = ISSUES.find(issue => issue.id === issueId) || null;
      resolve(issue);
    }, 300);
  });
};

// Function to check if user can access this issue
export const canUserAccessIssue = (user: User | null, issueId: string): boolean => {
  if (!user) return false;
  
  // Administrators can access everything
  if (user.role === UserRole.ADMINISTRATOR) return true;
  
  const issue = ISSUES.find(i => i.id === issueId);
  if (!issue) return false;
  
  // Project managers can access issues from their projects
  if (user.role === UserRole.PROJECT_MANAGER) {
    return user.projectIds?.includes(issue.projectId) || false;
  }
  
  // Employees cannot access any issue details
  return false;
};

// Generate PDF data for an issue
export const generateIssuePdfData = (issue: Issue): string => {
  // In a real application, this would generate actual PDF data
  // For this demo, we'll just return a string representation
  
  const statusText = {
    [IssueStatus.OPEN]: "Open",
    [IssueStatus.IN_PROGRESS]: "In Progress",
    [IssueStatus.CLOSED]: "Closed"
  };
  
  const commentsText = issue.comments.map(c => 
    `${c.userName} (${new Date(c.createdAt).toLocaleString()}): ${c.content}`
  ).join("\n");
  
  return `
    Issue Report
    ------------
    
    ID: ${issue.id}
    Project: ${issue.projectName}
    Title: ${issue.title}
    Reported by: ${issue.reporterName} on ${new Date(issue.createdAt).toLocaleString()}
    Status: ${statusText[issue.status]}
    
    Description:
    ${issue.description}
    
    Comments:
    ${commentsText || "No comments yet."}
  `;
};
