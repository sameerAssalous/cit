
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "./Dashboard";
import AppLayout from "@/components/layout/AppLayout";

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If not logged in, redirect to login
      navigate("/login");
    }
  }, [user, navigate]);

  // If user is logged in, show the dashboard wrapped in AppLayout
  return user ? (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ) : null;
};

export default Index;
