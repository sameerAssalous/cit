import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getIssue } from "@/services/issueService";
import { IssueDetail } from "@/components/issue/IssueDetail";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Issue, ApiIssue } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalization } from "@/context/LocalizationContext";

const transformApiIssueToIssue = (apiIssue: ApiIssue): Issue => {
  return {
    id: String(apiIssue.id),
    title: apiIssue.title,
    description: apiIssue.description,
    status: Number(apiIssue.status),
    reporterId: String(apiIssue.reporter_id),
    reporterName: apiIssue.reporterName || apiIssue.reported_by?.name || 'Unknown',
    projectId: String(apiIssue.project_id),
    projectName: apiIssue.projectName || apiIssue.project?.name || 'Unknown',
    createdAt: apiIssue.createdAt || apiIssue.created_at,
    comments: apiIssue.comments || [],
    imageUrl: apiIssue.attachment || undefined
  };
};

const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLocalization();
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadIssue = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id || !user) {
          throw new Error("Missing issue ID or user not authenticated");
        }
        
        // Check if user has permission to view this issue
        //if (!canUserAccessIssue(user, id)) {
        //  throw new Error("You don't have permission to view this issue");
        //}
        
        const fetchedIssue = await getIssue(id);
        
        if (!fetchedIssue) {
          throw new Error("Issue not found");
        }
        
        setIssue(transformApiIssueToIssue(fetchedIssue));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    loadIssue();
  }, [id, user]);
  
  const handleIssueUpdated = async () => {
    if (!id) return;
    
    try {
      const updatedIssue = await getIssue(id);
      if (updatedIssue) {
        setIssue(transformApiIssueToIssue(updatedIssue));
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
          <Button onClick={() => navigate("/")}>
            {t("common.back")} to Dashboard
          </Button>
        </Card>
      );
    }
    
    if (!issue || !user) {
      return (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">{t("issues.no_issues")}</p>
          <Button onClick={() => navigate("/")}>
            {t("common.back")} to Dashboard
          </Button>
        </Card>
      );
    }
    
    return <IssueDetail issue={issue} user={user} onIssueUpdated={handleIssueUpdated} />;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          onClick={() => navigate("/issues")}
          className="mr-4"
        >
          {t("common.back")} to {t("issues.issues")}
        </Button>
        <h1 className="text-2xl font-bold">{t("issues.issue_details")}</h1>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default IssueDetailPage;
