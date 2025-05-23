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
import { useTranslation } from "react-i18next";

const MainSidebar = () => {
  const { t } = useTranslation();
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
          <span className="sr-only">{t('common.toggle_menu')}</span>
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
                <span className="sr-only">{t('common.close')}</span>
              </Button>
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip={t('common.dashboard')}
                asChild 
                isActive={isActive("/")}
              >
                <Link to="/">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>{t('common.dashboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user.role != UserRole.EMPLOYEE && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={t('common.projects')}
                  asChild 
                  isActive={isActive("/projects")}
                >
                  <Link to="/projects">
                    <Briefcase className="h-5 w-5" />
                    <span>{t('common.projects')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip={t('common.issues')}
                asChild 
                isActive={isActive("/issues")}
              >
                <Link to="/issues">
                  <FileText className="h-5 w-5" />
                  <span>{t('common.issues')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user.role == UserRole.ADMINISTRATOR && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={t('common.logs')}
                  asChild 
                  isActive={isActive("/logs")}
                >
                  <Link to="/logs">
                    <Logs className="h-5 w-5" />
                    <span>{t('common.logs')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {hasPermission("view-users") && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={t('common.users')}
                  asChild 
                  isActive={isActive("/users")}
                >
                  <Link to="/users">
                    <Users className="h-5 w-5" />
                    <span>{t('common.users')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip={t('common.settings')}
                asChild 
                isActive={isActive("/settings")}
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span>{t('common.settings')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="text-xs text-gray-500 p-4 hidden md:block group-data-[collapsible=icon]:hidden">
            &copy; {new Date().getFullYear()} {t('common.app_name')}
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default MainSidebar;
