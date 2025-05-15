
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Issue, IssueStatus, UserRole } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface IssueCardProps {
  issue: Issue;
  userRole: UserRole;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, userRole }) => {
  // Only project managers and administrators can see issue details
  const canViewDetails = userRole === UserRole.PROJECT_MANAGER || userRole === UserRole.ADMINISTRATOR;
  
  const getStatusClass = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return "bg-construction-danger";
      case IssueStatus.IN_PROGRESS:
        return "bg-construction-warning";
      case IssueStatus.CLOSED:
        return "bg-construction-success";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return "Open";
      case IssueStatus.IN_PROGRESS:
        return "In Progress";
      case IssueStatus.CLOSED:
        return "Closed";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 animate-fade-in" style={{ 
      borderLeftColor: issue.status === IssueStatus.OPEN ? '#C62828' : 
                       issue.status === IssueStatus.IN_PROGRESS ? '#F9A825' : '#2E7D32' 
    }}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{issue.title}</h3>
          <Badge className={getStatusClass(issue.status)}>
            {getStatusText(issue.status)}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          <p>Project: {issue.projectName}</p>
          <p>Reported by: {issue.reporterName}</p>
          <p>Date: {formatDate(issue.createdAt)}</p>
        </div>
        
        <p className="text-gray-700 line-clamp-2">{issue.description}</p>
        
        {issue.imageUrl && (
          <div className="mt-3">
            <img 
              src={issue.imageUrl}
              alt="Issue"
              className="h-32 w-full object-cover rounded-md"
            />
          </div>
        )}
      </CardContent>
      
      {canViewDetails && (
        <CardFooter className="flex justify-between pt-2 pb-3">
          <div className="text-sm text-gray-500">
            {issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}
          </div>
          <Link
            to={`/issue/${issue.id}`}
            className="text-sm font-medium text-construction-tertiary hover:underline"
          >
            View Details
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default IssueCard;
