
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

interface IssueDetailProps {
  issue: Issue;
  user: User;
  onIssueUpdated: () => void;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issue, user, onIssueUpdated }) => {
  const [status, setStatus] = useState<IssueStatus>(issue.status);
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
        return "Open";
      case IssueStatus.IN_PROGRESS:
        return "In Progress";
      case IssueStatus.CLOSED:
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (newStatus === status) return;
    
    setIsSubmitting(true);
    
    try {
      await updateIssueStatus(String(issue.id), newStatus, String(user.id));
      setStatus(newStatus);
      onIssueUpdated();
      
      toast({
        title: "Status updated",
        description: `Issue status changed to ${getStatusText(newStatus)}.`
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Failed to update issue status. Please try again.",
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
      await addIssueComment(String(issue.id), String(user.id), user.name, comment);
      setComment("");
      onIssueUpdated();
      
      toast({
        title: "Comment added",
        description: "Your comment has been added to the issue."
      });
    } catch (error) {
      toast({
        title: "Error adding comment",
        description: "Failed to add comment. Please try again.",
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
        title: "PDF Generated",
        description: "The PDF has been generated and downloaded."
      });
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "Failed to generate PDF. Please try again.",
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
          <h3 className="text-sm font-medium text-gray-500 mb-1">Project</h3>
          <p className="text-gray-700">{issue.projectName}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Reported By</h3>
          <p className="text-gray-700">{issue.reporterName}</p>
          <p className="text-xs text-gray-500">{formatDate(issue.createdAt)}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
        </div>
        
        {issue.imageUrl && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Attached Image</h3>
            <img
              src={issue.imageUrl}
              alt="Issue attachment"
              className="max-h-96 rounded-md border border-gray-200"
            />
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Status</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGeneratePdf}
              disabled={isPdfGenerating}
            >
              {isPdfGenerating ? "Generating PDF..." : "Export as PDF"}
            </Button>
          </div>
          
          <Select
            value={status}
            onValueChange={(value: IssueStatus) => handleStatusChange(value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={IssueStatus.OPEN}>Open</SelectItem>
              <SelectItem value={IssueStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={IssueStatus.CLOSED}>Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Comments ({issue.comments.length})</h3>
          
          <div className="space-y-4">
            {issue.comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
              issue.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm">{comment.userName}</p>
                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Add Comment</h3>
          <form onSubmit={handleCommentSubmit}>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment..."
              className="min-h-[100px] mb-2"
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={!comment.trim() || isSubmitting}
            >
              {isSubmitting ? "Adding Comment..." : "Add Comment"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueDetail;
