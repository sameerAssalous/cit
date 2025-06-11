import React, { useState } from "react";
import { Issue, IssueStatus, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { updateIssueStatus, addIssueComment, exportIssuePdf } from "@/services/issueService";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface IssueDetailProps {
  issue: Issue;
  user: User;
  onIssueUpdated: () => void;
}

export const IssueDetail: React.FC<IssueDetailProps> = ({ issue, user, onIssueUpdated }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<IssueStatus>(typeof issue.status === 'string' ? 
    issue.status === 'open' ? IssueStatus.OPEN :
    issue.status === 'in_progress' ? IssueStatus.IN_PROGRESS :
    issue.status === 'closed' ? IssueStatus.CLOSED : IssueStatus.OPEN
    : issue.status as IssueStatus);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const { toast } = useToast();

  const getStatusClass = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return "bg-construction-danger";
      case IssueStatus.IN_PROGRESS:
        return "bg-construction-warning";
      case IssueStatus.CLOSED:
        return "bg-construction-success";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return t('issues.status.open');
      case IssueStatus.IN_PROGRESS:
        return t('issues.status.in_progress');
      case IssueStatus.CLOSED:
        return t('issues.status.closed');
      default:
        return t('issues.status.unknown');
    }
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (newStatus === status) return;
    
    setIsSubmitting(true);
    
    try {
      await updateIssueStatus(String(issue.id), newStatus);
      setStatus(newStatus);
      onIssueUpdated();
      
      toast({
        title: t('issues.status_update_success_title'),
        description: t('issues.status_update_success_description', { status: getStatusText(newStatus) })
      });
    } catch (error) {
      toast({
        title: t('issues.status_update_error_title'),
        description: t('issues.status_update_error_description'),
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addIssueComment(String(issue.id), comment);
      setComment("");
      onIssueUpdated();
      
      toast({
        title: t('issues.comment_add_success_title'),
        description: t('issues.comment_add_success_description')
      });
    } catch (error) {
      toast({
        title: t('issues.comment_add_error_title'),
        description: t('issues.comment_add_error_description'),
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePdf = async () => {
    setIsPdfGenerating(true);
    
    try {
      const blob = await exportIssuePdf(String(issue.id));
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `issue-${issue.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: t('issues.pdf_generate_success_title'),
        description: t('issues.pdf_generate_success_description')
      });
    } catch (error) {
      toast({
        title: t('issues.pdf_generate_error_title'),
        description: t('issues.pdf_generate_error_description'),
        variant: "destructive"
      });
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{issue.title}</CardTitle>
          <Badge className={getStatusClass(status)}>
            {getStatusText(status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t('issues.project')}</h3>
          <p className="text-gray-700">{issue.projectName}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t('issues.reported_by')}</h3>
          <p className="text-gray-700">{issue.reporterName}</p>
          <p className="text-xs text-gray-500">{formatDate(issue.createdAt)}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t('issues.description')}</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
        </div>
        
        {issue.imageUrl && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('issues.attached_image')}</h3>
            <img
              src={issue.imageUrl}
              alt={t('issues.attachment_alt')}
              className="max-h-96 rounded-md border border-gray-200"
            />
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">{t('issues.status_label')}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGeneratePdf}
              disabled={isPdfGenerating}
            >
              {isPdfGenerating ? t('issues.generating_pdf') : t('issues.export_pdf')}
            </Button>
          </div>
        
          
          <Select
            value={status}
            onValueChange={(value: IssueStatus) => handleStatusChange(value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('issues.select_status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={IssueStatus.OPEN}>{t('issues.status.open')}</SelectItem>
              <SelectItem value={IssueStatus.IN_PROGRESS}>{t('issues.status.in_progress')}</SelectItem>
              <SelectItem value={IssueStatus.CLOSED}>{t('issues.status.closed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">{t('issues.comments')}</h3>
          
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <Textarea
              placeholder={t('issues.comment_placeholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !comment.trim()}
            >
              {isSubmitting ? t('issues.submitting') : t('issues.add_comment')}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            {issue.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
