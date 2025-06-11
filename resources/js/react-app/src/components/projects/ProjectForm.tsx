import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UserRole } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProject, updateProject } from "@/services/projectService";
import { getUsers } from "@/services/userService";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, projectId }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = !!projectId;

  // Fetch project data if editing
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: isEditing,
  });

  // Fetch users for manager selection
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Filter project managers
  const projectManagers = users?.data?.filter(user => 
    user.role === UserRole.PROJECT_MANAGER || 
    user.roles?.some(role => role.name === "project_manager" || role.name === "admin")
  ) || [];

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: t('projects.form.create_success_title'),
        description: t('projects.form.create_success_description', { name }),
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: t('projects.form.error_title'),
        description: t('projects.form.create_error_description', { error: (error as Error).message }),
        variant: "destructive",
      });
    }
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: any }) => 
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast({
        title: t('projects.form.update_success_title'),
        description: t('projects.form.update_success_description', { name }),
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: t('projects.form.error_title'),
        description: t('projects.form.update_error_description', { error: (error as Error).message }),
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (project) {
      setName(project.name);
      setLocation(project.location || "");
      setDescription(project.description || "");
      if (project.manager_id) {
        setManagerId(String(project.manager_id));
      } else if (project.manager?.id) {
        setManagerId(String(project.manager.id));
      }
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !location) {
      toast({
        title: t('projects.form.missing_info_title'),
        description: t('projects.form.missing_info_description'),
        variant: "destructive",
      });
      return;
    }
    
    const projectData = {
      name,
      location,
      description,
      manager_id: managerId || undefined
    };
    
    if (isEditing && projectId) {
      updateMutation.mutate({ id: projectId, data: projectData });
    } else {
      createMutation.mutate(projectData);
    }
  };

  if (isEditing && isLoadingProject) {
    return <div>{t('projects.form.loading')}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('projects.form.edit_title') : t('projects.form.add_title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('projects.form.name_label')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('projects.form.name_placeholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t('projects.form.location_label')} *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('projects.form.location_placeholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('projects.form.description_label')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('projects.form.description_placeholder')}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managers">{t('projects.form.manager_label')}</Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger>
                <SelectValue placeholder={t('projects.form.manager_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingUsers ? (
                  <SelectItem value="loading" disabled>{t('projects.form.loading_managers')}</SelectItem>
                ) : projectManagers.length > 0 ? (
                  projectManagers.map(manager => (
                    <SelectItem key={String(manager.id)} value={String(manager.id)}>
                      {manager.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>{t('projects.no_manager')}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={createMutation.isPending || updateMutation.isPending}>
              {t('projects.form.cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending 
                ? t('projects.form.saving')
                : isEditing ? t('projects.form.update') : t('projects.form.create')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
