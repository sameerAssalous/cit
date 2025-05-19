
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import UserForm from "@/components/users/UserForm";
import { User } from "@/types";
import { getUsers } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";

const Users: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | number | undefined>();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error fetching users",
          description: "There was a problem loading the users data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  if (!user || !hasPermission("view-users")) {
    return <div className="p-8">You don't have permission to view this page.</div>;
  }

  // Filter users based on search
  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleLabel = (user: User) => {
    if (user.roles && user.roles.length > 0) {
      return user.roles.map(role => role.name).join(", ");
    }
    return "No role";
  };
  
  const getRoleBadgeClass = (user: User) => {
    if (!user.roles || user.roles.length === 0) return "bg-gray-500";
    
    // Check for highest role level (admin > project_manager > employee)
    if (user.roles.some(role => role.name === "admin")) {
      return "bg-purple-600";
    } else if (user.roles.some(role => role.name === "project_manager")) {
      return "bg-construction-tertiary";
    } else {
      return "bg-construction-secondary";
    }
  };
  
  const handleAddUser = () => {
    setEditingUserId(undefined);
    setIsUserFormOpen(true);
  };
  
  const handleEditUser = (userId: string | number) => {
    setEditingUserId(userId);
    setIsUserFormOpen(true);
  };
  
  const handleFormSuccess = (user: User) => {
    // Refresh the users list after successful form submission
    getUsers().then(response => setUsers(response.data));
    setIsUserFormOpen(false);
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-gray-600">Manage system users</p>
          </div>
          
          {hasPermission("create-users") && (
            <Button className="flex items-center gap-2" onClick={handleAddUser}>
              <Plus size={16} />
              <span>Add User</span>
            </Button>
          )}
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
                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                    {hasPermission("edit-users") && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeClass(u)}>
                            {getRoleLabel(u)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                        </TableCell>
                        {hasPermission("edit-users") && (
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal size={16} />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {hasPermission("edit-users") && (
                                  <DropdownMenuItem 
                                    className="flex items-center gap-2"
                                    onClick={() => handleEditUser(u.id)}
                                  >
                                    <Edit size={14} />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("delete-users") && (
                                  <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                    <Trash2 size={14} />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <UserForm 
          isOpen={isUserFormOpen} 
          onClose={() => setIsUserFormOpen(false)}
          userId={editingUserId}
          onSuccess={handleFormSuccess}
        />
      </div>
  );
};

export default Users;
