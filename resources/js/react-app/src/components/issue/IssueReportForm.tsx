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
import { useTranslation } from "react-i18next";
import { Image, X } from "lucide-react";

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
  attachment: z.instanceof(File).optional(),
});

interface IssueReportFormProps {
  initialProjectId?: string;
  onSuccess?: () => void;
}

const IssueReportForm: React.FC<IssueReportFormProps> = ({ initialProjectId, onSuccess }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('project_id', data.project_id);
      if (data.attachment) {
        formData.append('attachment', data.attachment);
      }
      return createIssue(formData);
    },
    onSuccess: () => {
      toast({
        title: t('issues.form.report_success_title'),
        description: t('issues.form.report_success_description'),
      });
      form.reset();
      setPreviewUrl(null);
      onSuccess?.();
      navigate("/issues");
    },
    onError: (error: any) => {
      toast({
        title: t('issues.form.error_title'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    createIssueMutation.mutate(values);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: t('issues.form.error_title'),
          description: t('issues.form.file_too_large'),
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: t('issues.form.error_title'),
          description: t('issues.form.invalid_file_type'),
          variant: "destructive",
        });
        return;
      }

      form.setValue('attachment', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue('attachment', undefined);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t('issues.form.title_label')}</Label>
          <Input id="title" placeholder={t('issues.form.title_placeholder')} {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('issues.form.description_label')}</Label>
          <Textarea id="description" placeholder={t('issues.form.description_placeholder')} {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_id">{t('issues.form.project_label')}</Label>
          <Select disabled={isLoadingProjects} onValueChange={form.setValue.bind(null, "project_id")}>
            <SelectTrigger id="project_id">
              <SelectValue placeholder={t('issues.form.project_placeholder')} defaultValue={form.getValues("project_id")} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingProjects ? (
                <SelectItem value="loading" disabled>{t('issues.form.loading_projects')}</SelectItem>
              ) : projectOptions.length > 0 ? (
                projectOptions.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>{t('issues.form.no_projects')}</SelectItem>
              )}
            </SelectContent>
          </Select>
          {form.formState.errors.project_id && (
            <p className="text-sm text-red-500">{form.formState.errors.project_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachment">{t('issues.form.attachment_label')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="attachment"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeImage}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {previewUrl && (
            <div className="mt-2 relative w-full max-w-xs">
              <img
                src={previewUrl}
                alt={t('issues.form.attachment_preview')}
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
          )}
          {form.formState.errors.attachment && (
            <p className="text-sm text-red-500">{form.formState.errors.attachment.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={createIssueMutation.isPending || isLoadingProjects}>
        {createIssueMutation.isPending ? t('issues.form.submitting') : t('issues.form.report_issue')}
      </Button>
    </form>
  );
};

export default IssueReportForm;
