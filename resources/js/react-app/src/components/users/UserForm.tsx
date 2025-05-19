
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { User } from "@/types";
import { getUser, createUser, updateUser } from "@/services/userService";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | number;
  onSuccess?: (user: User) => void;
}

interface Role {
  id: number;
  name: string;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, userId, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [roleId, setRoleId] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([
    { id: 2, name: "admin" },
    { id: 3, name: "project_manager" },
    { id: 4, name: "employee" }
  ]);
  
  const { toast } = useToast();
  
  const isEditing = !!userId;

  // Fetch user data when editing
  useEffect(() => {
    if (isOpen && isEditing && userId) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const userData = await getUser(userId);
          setName(userData.name);
          setEmail(userData.email);
          // Don't set password for security reasons
          setPassword("");
          setPasswordConfirmation("");
          
          // Set role ID if available
          if (userData.roles && userData.roles.length > 0) {
            setRoleId(userData.roles[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    } else if (isOpen) {
      // Reset form for new user
      resetForm();
    }
  }, [userId, isEditing, isOpen, toast]);
  
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setRoleId("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || (!isEditing && !password)) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password && password !== passwordConfirmation) {
      toast({
        title: "Password mismatch",
        description: "Password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name,
        email,
        role: Number(roleId),
        ...(password ? { 
          password, 
          password_confirmation: passwordConfirmation 
        } : {})
      };
      
      let result;
      
      if (isEditing && userId) {
        result = await updateUser(userId, userData);
        toast({
          title: "User updated",
          description: `User "${name}" has been updated successfully.`,
        });
      } else {
        if (!password) {
          toast({
            title: "Password required",
            description: "Password is required when creating a new user.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        result = await createUser({
          ...userData,
          password,
          password_confirmation: passwordConfirmation
        });
        
        toast({
          title: "User created",
          description: `User "${name}" has been created successfully.`,
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      handleClose();
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{isEditing ? "New Password (leave blank to keep current)" : "Password *"}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
              required={!isEditing}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              required={!!password}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select 
              value={roleId.toString()} 
              onValueChange={(value) => setRoleId(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
