
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface DashboardHeaderProps {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  closedIssues: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalIssues,
  openIssues,
  inProgressIssues,
  closedIssues,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  // Define dashboard title and description based on user role
  let dashboardTitle = "Dashboard";
  let dashboardDescription = "View and manage construction issues";

  switch (user.role) {
    case UserRole.ADMINISTRATOR:
      dashboardTitle = "Administrator Dashboard";
      dashboardDescription = "Manage all projects, issues, and users";
      break;
    case UserRole.PROJECT_MANAGER:
      dashboardTitle = "Project Manager Dashboard";
      dashboardDescription = "Manage your assigned projects and issues";
      break;
    case UserRole.EMPLOYEE:
      dashboardTitle = "Employee Dashboard";
      dashboardDescription = "Submit new construction issues";
      break;
  }

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
      <p className="text-gray-600">{dashboardDescription}</p>
      
      <div className="mt-2 text-sm">
        <div className="inline-flex items-center gap-2 mr-4">
          <span className="w-3 h-3 rounded-full bg-construction-danger"></span>
          <span>Open: {openIssues}</span>
        </div>
        <div className="inline-flex items-center gap-2 mr-4">
          <span className="w-3 h-3 rounded-full bg-construction-warning"></span>
          <span>In Progress: {inProgressIssues}</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-construction-success"></span>
          <span>Closed: {closedIssues}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
