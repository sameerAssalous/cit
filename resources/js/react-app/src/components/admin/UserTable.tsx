
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
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
        return "bg-blue-600";
      case UserRole.EMPLOYEE:
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Projects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeClass(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.role === UserRole.PROJECT_MANAGER ? 
                  (user.projectIds?.length || 0) + " projects" : 
                  "N/A"
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
