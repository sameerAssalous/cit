
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getUserProjects } from "@/services/mockData";
import { addIssue } from "@/services/issueService";

const IssueReportForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const projects = user ? getUserProjects(user) : [];

  // Check if a projectId was passed via location state
  useEffect(() => {
    if (location.state && location.state.projectId) {
      setProjectId(location.state.projectId);
    }
  }, [location.state]);

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
      
      // Redirect back to dashboard
      navigate("/dashboard");
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
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Report Construction Issue</CardTitle>
        </CardHeader>
        <CardContent>
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
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueReportForm;
