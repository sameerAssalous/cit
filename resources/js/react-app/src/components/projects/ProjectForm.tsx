
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PROJECTS, USERS } from "@/services/mockData";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, projectId }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [managers, setManagers] = useState<string[]>([]);
  const { toast } = useToast();
  
  const isEditing = !!projectId;
  
  // Get all project managers
  const projectManagers = USERS.filter(user => 
    user.role === UserRole.PROJECT_MANAGER
  );

  useEffect(() => {
    if (isEditing && projectId) {
      const project = PROJECTS.find(p => p.id === projectId);
      if (project) {
        setName(project.name);
        setLocation(project.location || "");
        // Access description if it exists, otherwise use empty string
        setDescription(project.description || "");
        setManagers(project.managerIds || []);
      }
    } else {
      // Reset form for new project
      setName("");
      setLocation("");
      setDescription("");
      setManagers([]);
    }
  }, [projectId, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !location) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isEditing && projectId) {
        // For demo purposes, we just show a toast
        // In a real app, this would update the project in the database
        toast({
          title: "Project updated",
          description: `Project "${name}" has been updated successfully.`,
        });
      } else {
        // For demo purposes, we just show a toast
        // In a real app, this would add a new project to the database
        toast({
          title: "Project created",
          description: `Project "${name}" has been created successfully.`,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter project location"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managers">Project Managers</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select managers" />
              </SelectTrigger>
              <SelectContent>
                {projectManagers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">
              Note: In this demo version, manager selection is not functional
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
