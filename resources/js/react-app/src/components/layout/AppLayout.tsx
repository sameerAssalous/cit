
import React from "react";
import Navbar from "./Navbar";
import MainSidebar from "./Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset className="flex flex-col">
          <Navbar />
          <main className="flex-1 animate-fade-in p-4 md:p-6">
            {children}
          </main>
          <footer className="bg-construction-primary text-white py-4">
            <div className="container mx-auto px-4 text-center text-sm">
              &copy; {new Date().getFullYear()} Construction Issue Tracker
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
