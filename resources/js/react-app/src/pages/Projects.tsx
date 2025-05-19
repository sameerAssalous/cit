
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

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
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
    return "None";
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const projects = projectsResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={handleAddProject} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Project</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Actions</TableHead>
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
                      <Link to={`/project/${String(project.id)}`}>View Details</Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No projects found
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
