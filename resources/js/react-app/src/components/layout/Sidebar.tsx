import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Settings, 
  Menu, 
  X,
  Logs
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { UserRole } from "@/types";

const MainSidebar = () => {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  if (!user) return null;
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      <Sidebar
        className="border-r"
        collapsible={isMobile ? "offcanvas" : "icon"}
      >
        <SidebarHeader className="border-b py-4">
          <div className="flex items-center justify-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-construction-primary text-white font-bold rounded-md p-2">
              E.B.
              </div>
              <span className="text-xl font-bold hidden sm:inline group-data-[collapsible=icon]:hidden">
                E.B. GmbH
              </span>
            </Link>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 h-8 w-8 p-0"
                onClick={() => setOpenMobile(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Dashboard"
                asChild 
                isActive={isActive("/")}
              >
                <Link to="/">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
 {user.role != UserRole.EMPLOYEE &&(
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Projects"
                asChild 
                isActive={isActive("/projects")}
              >
                <Link to="/projects">
                  <Briefcase className="h-5 w-5" />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
 )}
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Issues"
                asChild 
                isActive={isActive("/issues")}
              >
                <Link to="/issues">
                  <FileText className="h-5 w-5" />
                  <span>Issues</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user.role == UserRole.ADMINISTRATOR && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Logs"
                  asChild 
                  isActive={isActive("/logs")}
                >
                  <Link to="/logs">
                    <Logs className="h-5 w-5" />
                    <span>Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {hasPermission("view-users") && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Users"
                  asChild 
                  isActive={isActive("/users")}
                >
                  <Link to="/users">
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Settings"
                asChild 
                isActive={isActive("/settings")}
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="text-xs text-gray-500 p-4 hidden md:block group-data-[collapsible=icon]:hidden">
            &copy; {new Date().getFullYear()} Construction Issue Tracker
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default MainSidebar;
