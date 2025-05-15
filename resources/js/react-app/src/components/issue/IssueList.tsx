
import React, { useState } from "react";
import { Issue, IssueStatus, Project, UserRole } from "@/types";
import IssueCard from "./IssueCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface IssueListProps {
  issues: Issue[];
  projects: Project[];
  userRole: UserRole;
}

const IssueList: React.FC<IssueListProps> = ({ issues, projects, userRole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | "all">("all");

  // Filter issues based on search query, selected project, and status
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = selectedProject === "all" || issue.projectId === selectedProject;
    
    const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus;
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProject("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filter Issues</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search" className="text-sm">Search</Label>
            <Input
              id="search"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="project" className="text-sm">Project</Label>
            <Select
              value={selectedProject}
              onValueChange={(value) => setSelectedProject(value)}
            >
              <SelectTrigger id="project" className="mt-1">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status" className="text-sm">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: IssueStatus | "all") => setSelectedStatus(value)}
            >
              <SelectTrigger id="status" className="mt-1">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={IssueStatus.OPEN}>Open</SelectItem>
                <SelectItem value={IssueStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={IssueStatus.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear Filters
          </Button>
        </div>
      </div>
      
      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No issues found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              userRole={userRole} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;
