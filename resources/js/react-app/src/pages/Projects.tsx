import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types";
import { getProjects } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import ProjectForm from "@/components/projects/ProjectForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  
  const { data: projectsResponse, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects()
  });

  const handleAddProject = () => {
    setEditingProjectId(null);
    setIsProjectFormOpen(true);
  };

  const getManagerName = (project: Project): string => {
    if (project.manager) {
      return project.manager.name;
    }
    return t('common.none');
  };

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{t('common.error')}: {(error as Error).message}</div>;
  }

  const projects = projectsResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
        <Button onClick={handleAddProject} className="flex items-center gap-2">
          <Plus size={16} />
          <span>{t('projects.add_project')}</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('projects.project_list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  <SelectItem value="active">{t('projects.in_progress')}</SelectItem>
                  <SelectItem value="completed">{t('projects.completed')}</SelectItem>
                  <SelectItem value="on-hold">{t('projects.on_hold')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('logs.date_range')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('logs.all_time')}</SelectItem>
                  <SelectItem value="today">{t('logs.today')}</SelectItem>
                  <SelectItem value="yesterday">{t('logs.yesterday')}</SelectItem>
                  <SelectItem value="week">{t('logs.custom_range')}</SelectItem>
                  <SelectItem value="month">{t('logs.custom_range')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('projects.name')}</TableHead>
                <TableHead>{t('projects.location')}</TableHead>
                <TableHead>{t('projects.manager')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={String(project.id)}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell>{getManagerName(project)}</TableCell>
                    <TableCell>
                      <Link to={`/projects/${String(project.id)}`}>{t('projects.view_details')}</Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {t('projects.no_projects')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isProjectFormOpen && (
        <ProjectForm
          isOpen={isProjectFormOpen}
          onClose={() => setIsProjectFormOpen(false)}
          projectId={editingProjectId}
        />
      )}
    </div>
  );
};

export default Projects;
