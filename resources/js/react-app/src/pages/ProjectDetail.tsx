
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PROJECTS, ISSUES, USERS } from "@/services/mockData";
import { useAuth } from "@/context/AuthContext";
import { IssueStatus, UserRole } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Download, Edit, Eye, MessageSquare, Plus } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import IssueReportModal from "@/components/issue/IssueReportModal";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isIssueReportModalOpen, setIsIssueReportModalOpen] = useState(false);
  
  if (!user) return null;
  
  const project = PROJECTS.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-8">The project you're looking for doesn't exist or you don't have access.</p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Check if user has access to this project
  const hasAccess = user.role === UserRole.ADMINISTRATOR || 
    (user.role === UserRole.PROJECT_MANAGER && user.projectIds?.includes(project.id));
    
  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-8">You don't have permission to view this project.</p>
          <Button asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Get project manager names
  const projectManagers = USERS.filter(u => 
    project.managerIds.includes(u.id) && u.role === UserRole.PROJECT_MANAGER
  );
  
  // Get issues for this project
  const projectIssues = ISSUES.filter(issue => issue.projectId === project.id);
  
  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
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

  const handleReportIssue = () => {
    setIsIssueReportModalOpen(true);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <Link to="/projects" className="flex items-center text-sm font-medium text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-600 mb-2">Location: {project.location}</p>
            <div className="text-sm text-gray-500">
              <span>Managers: </span>
              {projectManagers.length > 0 ? (
                projectManagers.map(pm => pm.name).join(", ")
              ) : (
                "No managers assigned"
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user.role === UserRole.ADMINISTRATOR && (
              <Button variant="outline" className="flex items-center gap-1">
                <Edit size={16} />
                <span>Edit</span>
              </Button>
            )}
            
            <Button className="flex items-center gap-1" onClick={handleReportIssue}>
              <Plus size={16} />
              <span>Report Issue</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Project Issues</CardTitle>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download size={16} />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectIssues.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No issues reported for this project yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      projectIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium max-w-[250px] truncate">{issue.title}</TableCell>
                          <TableCell>{issue.reporterName}</TableCell>
                          <TableCell>{formatDate(issue.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(issue.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              <span>{issue.comments.length}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/issue/${issue.id}`}>
                                <Eye size={16} />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <IssueReportModal
          isOpen={isIssueReportModalOpen}
          onClose={() => setIsIssueReportModalOpen(false)}
          initialProjectId={project.id}
        />
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;
