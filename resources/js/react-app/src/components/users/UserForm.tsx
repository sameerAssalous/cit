
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { USERS, PROJECTS } from "@/services/mockData";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, userId }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const isEditing = !!userId;

  // Reset form when isOpen changes or userId changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && userId) {
        const user = USERS.find(u => u.id === userId);
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setLocation(user.location || "");
          setRole(user.role);
          setPassword(""); // We don't show existing password for security reasons
        }
      } else {
        // Reset form for new user
        resetForm();
      }
    }
  }, [userId, isEditing, isOpen]);
  
  const resetForm = () => {
    setName("");
    setEmail("");
    setLocation("");
    setRole(UserRole.EMPLOYEE);
    setPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || (!isEditing && !password)) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isEditing && userId) {
        // For demo purposes, we just show a toast
        // In a real app, this would update the user in the database
        toast({
          title: "User updated",
          description: `User "${name}" has been updated successfully.`,
        });
      } else {
        // For demo purposes, we just show a toast
        // In a real app, this would add a new user to the database
        toast({
          title: "User created",
          description: `User "${name}" has been created successfully.`,
        });
      }
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required={!isEditing}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                <SelectItem value={UserRole.PROJECT_MANAGER}>Project Manager</SelectItem>
                <SelectItem value={UserRole.ADMINISTRATOR}>Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
