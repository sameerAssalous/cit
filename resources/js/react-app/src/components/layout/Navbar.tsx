
import React from "react";
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";
import { UserRole } from "@/types";
import { useLocalization } from "@/context/LocalizationContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLocalization();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMINISTRATOR:
        return t("dashboard.admin_dashboard");
      case UserRole.PROJECT_MANAGER:
        return t("dashboard.project_manager_dashboard");
      case UserRole.EMPLOYEE:
        return t("dashboard.employee_dashboard");
      default:
        return "User";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center md:w-64">
            <Logo />
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 rounded-full bg-construction-tertiary text-white flex items-center justify-center">
                      {getInitials(user.name)}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{getRoleLabel(user.role)}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings size={16} />
                      <span>{t("settings.settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer text-red-600"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">{t("auth.signin")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
