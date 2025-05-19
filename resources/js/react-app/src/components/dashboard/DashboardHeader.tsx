
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useLocalization } from "@/context/LocalizationContext";

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
  const { t } = useLocalization();

  if (!user) return null;

  // Define dashboard title and description based on user role
  let dashboardTitle = t("dashboard.dashboard");
  let dashboardDescription = t("dashboard.submit_issues");

  switch (user.role) {
    case UserRole.ADMINISTRATOR:
      dashboardTitle = t("dashboard.admin_dashboard");
      dashboardDescription = t("dashboard.manage_all");
      break;
    case UserRole.PROJECT_MANAGER:
      dashboardTitle = t("dashboard.project_manager_dashboard");
      dashboardDescription = t("dashboard.manage_projects");
      break;
    case UserRole.EMPLOYEE:
      dashboardTitle = t("dashboard.employee_dashboard");
      dashboardDescription = t("dashboard.submit_issues");
      break;
  }

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{dashboardTitle}</h1>
      <p className="text-gray-600">{dashboardDescription}</p>
      
      <div className="mt-2 text-sm">
        <div className="inline-flex items-center gap-2 mr-4">
          <span className="w-3 h-3 rounded-full bg-construction-danger"></span>
          <span>{t("dashboard.open")}: {openIssues}</span>
        </div>
        <div className="inline-flex items-center gap-2 mr-4">
          <span className="w-3 h-3 rounded-full bg-construction-warning"></span>
          <span>{t("dashboard.in_progress")}: {inProgressIssues}</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-construction-success"></span>
          <span>{t("dashboard.closed")}: {closedIssues}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
