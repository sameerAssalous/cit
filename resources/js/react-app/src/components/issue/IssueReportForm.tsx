import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { IssueStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { createIssue } from "@/services/issueService";
import { getProjects } from "@/services/projectService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  project_id: z.string().min(1, {
    message: "Please select a project.",
  }),
});

interface IssueReportFormProps {
  initialProjectId?: string;
  onSuccess?: () => void;
}

const IssueReportForm: React.FC<IssueReportFormProps> = ({ initialProjectId, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { data: projectsResponse, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      project_id: initialProjectId || "",
    },
    mode: "onChange",
  });

  const projectOptions = projectsResponse?.data || [];

  const createIssueMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return createIssue(data);
    },
    onSuccess: () => {
      toast({
        title: "Issue reported successfully!",
        description: "Your issue has been submitted.",
      });
      form.reset();
      onSuccess?.();
      navigate("/issues");
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    createIssueMutation.mutate(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Issue Title</Label>
          <Input id="title" placeholder="Enter issue title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter issue description" {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_id">Project</Label>
          <Select disabled={isLoadingProjects} onValueChange={form.setValue.bind(null, "project_id")}>
            <SelectTrigger id="project_id">
              <SelectValue placeholder="Select a project" defaultValue={form.getValues("project_id")} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingProjects ? (
                <SelectItem value="loading" disabled>Loading projects...</SelectItem>
              ) : projectOptions.length > 0 ? (
                projectOptions.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No projects available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {form.formState.errors.project_id && (
            <p className="text-sm text-red-500">{form.formState.errors.project_id.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={createIssueMutation.isPending || isLoadingProjects}>
        {createIssueMutation.isPending ? "Submitting..." : "Report Issue"}
      </Button>
    </form>
  );
};

export default IssueReportForm;
