
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project, User, UserRole } from "@/types";

interface ProjectTableProps {
  projects: Project[];
  users: User[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, users }) => {
  const getManagerNames = (managerIds: string[]) => {
    if (!managerIds.length) return "None";
    
    const managers = users
      .filter(user => managerIds.includes(user.id))
      .map(user => user.name);
    
    return managers.join(", ");
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
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>{getManagerNames(project.managerIds)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
