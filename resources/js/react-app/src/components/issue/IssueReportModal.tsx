import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getUserProjects } from "@/services/mockData";
import { addIssue } from "@/services/issueService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
}

const IssueReportModal: React.FC<IssueReportModalProps> = ({ isOpen, onClose, initialProjectId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const projects = user ? getUserProjects(user) : [];

  // Set initial project ID if provided
  useEffect(() => {
    if (initialProjectId) {
      setProjectId(initialProjectId);
    } else {
      setProjectId("");
    }
  }, [initialProjectId, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    // Don't reset projectId here as we want to keep the selected project if initialProjectId was provided
    setImageFile(null);
    setImagePreviewUrl(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImageFile(file);
      setImagePreviewUrl(reader.result as string);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      if (!title || !description || !projectId) {
        throw new Error("Please fill in all required fields");
      }
      
      // In a real app, we would upload the image to a server
      // and get back a URL. Here we'll use the preview URL for demo purposes.
      await addIssue(
        title,
        description,
        projectId,
        user.id,
        user.name,
        imagePreviewUrl || undefined
      );
      
      toast({
        title: "Issue reported successfully",
        description: "Thank you for reporting this issue. A project manager will review it shortly.",
      });
      
      // Close the modal
      onClose();
    } catch (error: any) {
      toast({
        title: "Error submitting issue",
        description: error.message || "An error occurred while submitting the issue.",
        variant: "destructive",
      });
      console.error("Error submitting issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Report Construction Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            <Select
              value={projectId}
              onValueChange={setProjectId}
              required
            >
              <SelectTrigger id="project" className="w-full">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title describing the issue"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about the issue"
              rows={6}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image Attachment (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            
            {imagePreviewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                <img 
                  src={imagePreviewUrl} 
                  alt="Issue preview" 
                  className="max-h-64 rounded-md border border-gray-300" 
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !title || !description || !projectId}
              className="bg-construction-primary hover:bg-construction-tertiary"
            >
              {isSubmitting ? "Submitting..." : "Report Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IssueReportModal;
