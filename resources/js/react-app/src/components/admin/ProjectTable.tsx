
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project, User, UserRole } from "@/types";

interface ProjectTableProps {
  projects: Project[];
  users: User[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, users }) => {
  const getManagerName = (project: Project) => {
    if (!project.manager_id) return "None";
    
    const manager = users.find(user => String(user.id) === String(project.manager_id));
    return manager ? manager.name : "None";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Managers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={String(project.id)}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>
                {project.manager ? project.manager.name : getManagerName(project)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
