
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/types";
import IssueReportModal from "@/components/issue/IssueReportModal";

const ReportIssuePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Only employees can report issues
  if (user?.role !== UserRole.EMPLOYEE) {
    return <Navigate to="/dashboard" />;
  }

  // When the modal is closed, redirect to dashboard
  const handleModalClose = () => {
    setIsModalOpen(false);
    // Use a short timeout to ensure the modal transition completes
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 100);
  };
  
  return (
    <IssueReportModal 
      isOpen={isModalOpen} 
      onClose={handleModalClose}
    />
  );
};

export default ReportIssuePage;
