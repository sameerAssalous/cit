import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProject, exportProject } from "@/services/projectService";
import { useAuth } from "@/context/AuthContext";
import { ApiIssue, IssueStatus, Project } from "@/types";
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
import { ArrowLeft, Download, Edit, Eye, Plus } from "lucide-react";
import IssueReportModal from "@/components/issue/IssueReportModal";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ProjectDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isIssueReportModalOpen, setIsIssueReportModalOpen] = useState(false);
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });

  const exportMutation = useMutation({
    mutationFn: (projectId: string) => exportProject(projectId),
    onSuccess: (blob) => {
      try {
        if (!(blob instanceof Blob)) {
          throw new Error('Invalid response format');
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `project-${id}-export.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: t('common.success'),
          description: t('projects.export_success'),
        });
      } catch (error) {
        console.error('Download error:', error);
        toast({
          title: t('common.error'),
          description: t('projects.export_error'),
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Export error:', error);
      const errorMessage = error.response?.data?.message || t('projects.export_error');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleExport = () => {
    if (id) {
      exportMutation.mutate(id);
    }
  };
  
  if (!user) return null;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">{t('common.loading')}</div>;
  }
  
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('projects.not_found')}</h1>
        <p className="mb-8">{t('projects.not_found_description')}</p>
        <Button asChild>
          <Link to="/projects">{t('common.back_to_projects')}</Link>
        </Button>
      </div>
    );
  }

  if (!hasPermission("view-projects")) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('common.access_denied')}</h1>
        <p className="mb-8">{t('projects.no_permission')}</p>
        <Button asChild>
          <Link to="/projects">{t('common.back_to_projects')}</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string | number) => {
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
      statusString = status as unknown as IssueStatus;
    }
    
    switch (statusString) {
      case IssueStatus.OPEN:
        return <Badge className="bg-construction-danger">{t('issues.status.open')}</Badge>;
      case IssueStatus.IN_PROGRESS:
        return <Badge className="bg-construction-warning">{t('issues.status.in_progress')}</Badge>;
      case IssueStatus.CLOSED:
        return <Badge className="bg-construction-success">{t('issues.status.closed')}</Badge>;
      default:
        return <Badge>{t('issues.status.unknown')}</Badge>;
    }
  };

  const handleReportIssue = () => {
    setIsIssueReportModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/projects" className="flex items-center text-sm font-medium text-muted-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back_to_projects')}
      </Link>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mb-2">{t('projects.location')}: {project.location}</p>
          <div className="text-sm text-gray-500">
            <span>{t('projects.manager')}: </span>
            {project.manager ? project.manager.name : t('projects.no_manager')}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasPermission("edit-projects") && (
            <Button variant="outline" className="flex items-center gap-1">
              <Edit size={16} />
              <span>{t('common.edit')}</span>
            </Button>
          )}
          
          {hasPermission("create-issues") && (
            <Button className="flex items-center gap-1" onClick={handleReportIssue}>
              <Plus size={16} />
              <span>{t('issues.report_issue')}</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>{t('projects.issues')}</CardTitle>
              {hasPermission("view-issues") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1" 
                  onClick={handleExport}
                  disabled={exportMutation.isPending}
                >
                  <Download size={16} />
                  <span>{exportMutation.isPending ? t('common.exporting') : t('common.export')}</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('issues.title')}</TableHead>
                    <TableHead>{t('issues.reporter')}</TableHead>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
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
                        </TableCell>
                        <TableCell>{formatDate(issue.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell className="text-right">
                          {hasPermission("view-issues") && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/issues/${String(issue.id)}`}>
                                <Eye size={16} />
                                <span className="sr-only">{t('common.view')}</span>
                              </Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {t('projects.no_issues')}
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
        initialProjectId={String(project.id)}
      />
    </div>
  );
};

export default ProjectDetail;
