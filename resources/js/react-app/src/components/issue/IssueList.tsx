
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiIssue, Issue, IssueStatus } from "@/types";
import { formatDate } from "@/lib/utils";

interface IssueListProps {
  issues: ApiIssue[];
  isLoading?: boolean;
}

const IssueList: React.FC<IssueListProps> = ({ issues, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Loading issues...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No issues found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string | number) => {
    // Convert numerical status to string status
    let statusString: IssueStatus;
    
    if (typeof status === "number") {
      switch (status) {
        case 1:
          statusString = IssueStatus.OPEN;
          break;
        case 2:
          statusString = IssueStatus.IN_PROGRESS;
          break;
        case 3:
          statusString = IssueStatus.CLOSED;
          break;
        default:
          statusString = IssueStatus.OPEN;
      }
    } else {
      statusString = status as IssueStatus;
    }
    
    switch (statusString) {
      case IssueStatus.OPEN:
        return <Badge className="bg-construction-danger">Open</Badge>;
      case IssueStatus.IN_PROGRESS:
        return <Badge className="bg-construction-warning">In Progress</Badge>;
      case IssueStatus.CLOSED:
        return <Badge className="bg-construction-success">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {issues.map((issue) => (
        <Link to={`/issue/${String(issue.id)}`} key={String(issue.id)}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Project: {issue.project?.name || "Unknown"}
                  </p>
                </div>
                {getStatusBadge(issue.status)}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {issue.description}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <div>Reported by: {issue.reported_by?.name || "Unknown"}</div>
                <div>Created: {formatDate(issue.created_at)}</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default IssueList;
