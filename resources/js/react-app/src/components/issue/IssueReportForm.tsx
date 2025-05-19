
import React, { useState, useEffect } from "react";
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
import { IssueStatus, UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { createIssue } from "@/services/issueService";
import { getProjects } from "@/services/projectService";
import { getUsers } from "@/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  projectId: z.string().min(1, {
    message: "Please select a project.",
  }),
  reporterId: z.string().min(1, {
    message: "Please select a reporter.",
  }),
  status: z.enum([IssueStatus.OPEN, IssueStatus.IN_PROGRESS, IssueStatus.CLOSED]).default(IssueStatus.OPEN),
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

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: initialProjectId || "",
      reporterId: user?.id || "",
      status: IssueStatus.OPEN,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.setValue("reporterId", user.id);
    }
  }, [user, form]);

  const projectOptions = projectsResponse?.data || [];
  const reporterOptions = usersData?.data?.filter(user => user.role === UserRole.EMPLOYEE) || [];

  const createIssueMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => createIssue(data),
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
          <Label htmlFor="projectId">Project</Label>
          <Select disabled={isLoadingProjects} onValueChange={form.setValue.bind(null, "projectId")}>
            <SelectTrigger id="projectId">
              <SelectValue placeholder="Select a project" defaultValue={form.getValues("projectId")} />
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
          {form.formState.errors.projectId && (
            <p className="text-sm text-red-500">{form.formState.errors.projectId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reporterId">Reporter</Label>
          <Select disabled={isLoadingUsers} onValueChange={form.setValue.bind(null, "reporterId")}>
            <SelectTrigger id="reporterId">
              <SelectValue placeholder="Select a reporter" defaultValue={form.getValues("reporterId")} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingUsers ? (
                <SelectItem value="loading" disabled>Loading reporters...</SelectItem>
              ) : reporterOptions.length > 0 ? (
                reporterOptions.map((reporter) => (
                  <SelectItem key={reporter.id} value={String(reporter.id)}>
                    {reporter.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>No reporters available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {form.formState.errors.reporterId && (
            <p className="text-sm text-red-500">{form.formState.errors.reporterId.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={createIssueMutation.isPending || isLoadingProjects || isLoadingUsers}>
        {createIssueMutation.isPending ? "Submitting..." : "Report Issue"}
      </Button>
    </form>
  );
};

export default IssueReportForm;
