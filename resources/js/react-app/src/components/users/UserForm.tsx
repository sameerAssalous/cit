import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [roleId, setRoleId] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "admin" },
    { id: 2, name: "project_manager" },
    { id: 3, name: "employee" }
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
        title: t('users.form.missing_info_title'),
        description: t('users.form.missing_info_description'),
        variant: "destructive",
      });
      return;
    }
    
    if (password && password !== passwordConfirmation) {
      toast({
        title: t('users.form.password_mismatch_title'),
        description: t('users.form.password_mismatch_description'),
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
          title: t('users.form.update_success_title'),
          description: t('users.form.update_success_description', { name }),
        });
      } else {
        if (!password) {
          toast({
            title: t('users.form.password_required_title'),
            description: t('users.form.password_required_description'),
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
          title: t('users.form.create_success_title'),
          description: t('users.form.create_success_description', { name }),
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      handleClose();
    } catch (error: any) {
      console.error("Error saving user:", error);
      toast({
        title: t('users.form.error_title'),
        description: error.response?.data?.message || t('users.form.error_description'),
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
          <DialogTitle>{isEditing ? t('users.form.edit_title') : t('users.form.add_title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('users.form.name_label')} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('users.form.name_placeholder')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('users.form.email_label')} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('users.form.email_placeholder')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? t('users.form.password_edit_label') : t('users.form.password_label')} *
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? t('users.form.password_edit_placeholder') : t('users.form.password_placeholder')}
              required={!isEditing}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">{t('users.form.password_confirm_label')}</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder={t('users.form.password_confirm_placeholder')}
              required={!!password}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t('users.form.role_label')} *</Label>
            <Select 
              value={roleId.toString()} 
              onValueChange={(value) => setRoleId(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder={t('users.form.role_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {t(`users.roles.${role.name}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              {t('users.form.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEditing ? t('users.form.update') : t('users.form.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
