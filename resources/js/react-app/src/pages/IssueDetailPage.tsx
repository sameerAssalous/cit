
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getIssueById, canUserAccessIssue } from "@/services/issueService";
import IssueDetail from "@/components/issue/IssueDetail";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Issue } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/components/layout/AppLayout";

const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadIssue = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!issueId || !user) {
          throw new Error("Missing issue ID or user not authenticated");
        }
        
        // Check if user has permission to view this issue
        if (!canUserAccessIssue(user, issueId)) {
          throw new Error("You don't have permission to view this issue");
        }
        
        const fetchedIssue = await getIssueById(issueId);
        
        if (!fetchedIssue) {
          throw new Error("Issue not found");
        }
        
        setIssue(fetchedIssue);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    loadIssue();
  }, [issueId, user]);
  
  const handleIssueUpdated = async () => {
    if (!issueId) return;
    
    try {
      const updatedIssue = await getIssueById(issueId);
      if (updatedIssue) {
        setIssue(updatedIssue);
      }
    } catch (err) {
      console.error("Failed to refresh issue:", err);
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <Card className="p-6">
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>
      );
    }
    
    if (error) {
      return (
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </Card>
      );
    }
    
    if (!issue || !user) {
      return (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">Issue not found</p>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </Card>
      );
    }
    
    return <IssueDetail issue={issue} user={user} onIssueUpdated={handleIssueUpdated} />;
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/issues")}
            className="mr-4"
          >
            Back to Issues
          </Button>
          <h1 className="text-2xl font-bold">Issue Details</h1>
        </div>
        
        {renderContent()}
      </div>
    </AppLayout>
  );
};

export default IssueDetailPage;
