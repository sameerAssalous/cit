
import React, { useState } from "react";
import { PROJECTS, USERS, ISSUES } from "@/services/mockData";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Download, Eye, Edit, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectForm from "@/components/projects/ProjectForm";
import { useNavigate } from "react-router-dom";
import IssueReportModal from "@/components/issue/IssueReportModal";

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(PROJECTS);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | undefined>();
  const [isIssueReportModalOpen, setIsIssueReportModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();

  if (!user) return null;

  // Filter projects for project managers
  const displayProjects = user.role === UserRole.PROJECT_MANAGER 
    ? projects.filter(project => project.managerIds.includes(user.id))
    : projects;

  // Get issue count for each project
  const getIssueCount = (projectId: string) => {
    return ISSUES.filter(issue => issue.projectId === projectId).length;
  };
  
  const handleAddProject = () => {
    setEditingProjectId(undefined);
    setIsProjectFormOpen(true);
  };
  
  const handleEditProject = (projectId: string) => {
    setEditingProjectId(projectId);
    setIsProjectFormOpen(true);
  };

  const handleReportIssueClick = (projectId?: string) => {
    setSelectedProjectId(projectId);
    setIsIssueReportModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600">Manage construction projects</p>
        </div>
        
        {user.role === UserRole.ADMINISTRATOR && (
          <Button 
            onClick={handleAddProject}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Project</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Project List</CardTitle>
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
                  <TableHead>Project Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayProjects.map((project) => {
                  const manager = USERS.find(u => project.managerIds.includes(u.id));
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{manager?.name || "Unassigned"}</TableCell>
                      <TableCell>{getIssueCount(project.id)}</TableCell>
                      <TableCell>{project.createdAt ? formatDate(project.createdAt) : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/project/${project.id}`}>
                              <Eye size={16} />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>

                          {user.role === UserRole.ADMINISTRATOR && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditProject(project.id)}
                            >
                              <Edit size={16} />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <ProjectForm 
        isOpen={isProjectFormOpen} 
        onClose={() => setIsProjectFormOpen(false)} 
        projectId={editingProjectId} 
      />

      <IssueReportModal
        isOpen={isIssueReportModalOpen}
        onClose={() => setIsIssueReportModalOpen(false)}
        initialProjectId={selectedProjectId}
      />

      {/* Add a Report Issue button at the bottom of the page */}
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={() => handleReportIssueClick()}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Report Issue</span>
        </Button>
      </div>
    </div>
  );
};

export default Projects;
