
import React, { useState } from "react";
import { USERS, PROJECTS } from "@/services/mockData";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import UserForm from "@/components/users/UserForm";

const Users: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | undefined>();
  
  if (!user || user.role !== UserRole.ADMINISTRATOR) {
    return <div className="p-8">You don't have permission to view this page.</div>;
  }

  // Filter users based on search
  const filteredUsers = USERS.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return "Administrator";
      case UserRole.PROJECT_MANAGER:
        return "Project Manager";
      case UserRole.EMPLOYEE:
        return "Employee";
      default:
        return "User";
    }
  };
  
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return "bg-purple-600";
      case UserRole.PROJECT_MANAGER:
        return "bg-construction-tertiary";
      case UserRole.EMPLOYEE:
        return "bg-construction-secondary";
      default:
        return "bg-gray-500";
    }
  };

  const getUserProjects = (userId: string) => {
    if (!userId) return "N/A";
    
    const userProjectIds = USERS.find(u => u.id === userId)?.projectIds || [];
    if (userProjectIds.length === 0) return "None";
    
    const projectNames = userProjectIds.map(id => {
      const project = PROJECTS.find(p => p.id === id);
      return project?.name || "Unknown";
    });
    
    return projectNames.join(", ");
  };
  
  const handleAddUser = () => {
    setEditingUserId(undefined);
    setIsUserFormOpen(true);
  };
  
  const handleEditUser = (userId: string) => {
    setEditingUserId(userId);
    setIsUserFormOpen(true);
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-gray-600">Manage system users</p>
          </div>
          
          <Button className="flex items-center gap-2" onClick={handleAddUser}>
            <Plus size={16} />
            <span>Add User</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <CardTitle>User Management</CardTitle>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Projects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeClass(u.role)}>
                          {getRoleLabel(u.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{u.location || "N/A"}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                        {getUserProjects(u.id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => handleEditUser(u.id)}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <UserForm 
          isOpen={isUserFormOpen} 
          onClose={() => setIsUserFormOpen(false)}
          userId={editingUserId}  
        />
      </div>
  );
};

export default Users;
