
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProject, getProjects } from "@/services/projectService";
import { useAuth } from "@/context/AuthContext";
import { ApiIssue, IssueStatus, UserRole } from "@/types";
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
import IssueReportModal from "@/components/issue/IssueReportModal";
import { useToast } from "@/components/ui/use-toast";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isIssueReportModalOpen, setIsIssueReportModalOpen] = useState(false);
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
  });

  const exportMutation = useMutation({
    mutationFn: getProjects,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectId}-export.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Export successful",
        description: "Project report has been downloaded.",
      });
    },
    onError: () => {
      toast({
        title: "Export failed",
        description: "Failed to export project report.",
        variant: "destructive",
      });
    }
  });

  const handleExport = () => {
    if (projectId) {
      exportMutation.mutate(projectId);
    }
  };
  
  if (!user) return null;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">Loading project details...</div>;
  }
  
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="mb-8">The project you're looking for doesn't exist or you don't have access.</p>
        <Button asChild>
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  // Check if user has access to this project
  const hasAccess = user.role === UserRole.ADMINISTRATOR || 
    (user.role === UserRole.PROJECT_MANAGER && (
      user.projectIds?.includes(project.id) || 
      (project.manager && String(project.manager.id) === String(user.id))
    ));
    
  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-8">You don't have permission to view this project.</p>
        <Button asChild>
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
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

  const handleReportIssue = () => {
    setIsIssueReportModalOpen(true);
  };

  return (
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
            <span>Manager: </span>
            {project.manager ? project.manager.name : "No manager assigned"}
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={handleExport}
                disabled={exportMutation.isPending}
              >
                <Download size={16} />
                <span>{exportMutation.isPending ? "Exporting..." : "Export"}</span>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.issues && project.issues.length > 0 ? (
                    project.issues.map((issue) => (
                      <TableRow key={String(issue.id)}>
                        <TableCell className="font-medium max-w-[250px] truncate">
                          {issue.title}
                        </TableCell>
                        <TableCell>
                          {/* Reporter name may not be available in this response */}
                          {/* So we leave it out for now */}
                        </TableCell>
                        <TableCell>{formatDate(issue.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/issue/${String(issue.id)}`}>
                              <Eye size={16} />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No issues reported for this project yet
                      </TableCell>
                    </TableRow>
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
  );
};

export default ProjectDetail;
