
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { IssueStatus, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Calendar as CalendarIcon } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Search } from "lucide-react";
import { format, subDays, startOfToday, startOfYesterday, startOfWeek, startOfMonth } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useQuery } from "@tanstack/react-query";
import { getIssues } from "@/services/issueService";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/dashboard";
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  // Fetch all issues from API
  const { data: issuesResponse, isLoading } = useQuery({
    queryKey: ['dashboard-issues'],
    queryFn: () => getIssues(),
  });

  const allIssues = issuesResponse?.data || [];
  
  // Calculate counts
  const openIssues = allIssues.filter(issue => issue.status === IssueStatus.OPEN || issue.status === 1);
  const inProgressIssues = allIssues.filter(issue => issue.status === IssueStatus.IN_PROGRESS || issue.status === 2);
  const closedIssues = allIssues.filter(issue => issue.status === IssueStatus.CLOSED || issue.status === 3);
  
  // Get unique projects from issues
  const uniqueProjects = [...new Set(allIssues.map(issue => issue.project?.id || issue.projectId))];
  
  // Filter recent issues
  const filteredRecentIssues = allIssues
    .filter(issue => {
      const matchesSearch = searchQuery
        ? (issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      const issueStatus = typeof issue.status === 'string' ? issue.status : 
                         issue.status === 1 ? IssueStatus.OPEN :
                         issue.status === 2 ? IssueStatus.IN_PROGRESS :
                         issue.status === 3 ? IssueStatus.CLOSED : '';

      const matchesStatus = selectedStatus === "all" || issueStatus === selectedStatus;
      const matchesProject = selectedProject === "all" || 
                            String(issue.project?.id) === selectedProject || 
                            String(issue.projectId) === selectedProject;
      
      // Filter by date
      let matchesDate = true;
      const issueDate = new Date(issue.created_at || issue.createdAt);
      const today = startOfToday();
      
      if (dateFilter) {
        // If a specific date is selected, compare with that date
        const filterDate = new Date(dateFilter);
        matchesDate = 
          issueDate.getFullYear() === filterDate.getFullYear() && 
          issueDate.getMonth() === filterDate.getMonth() && 
          issueDate.getDate() === filterDate.getDate();
      } else if (selectedDateRange === 'today') {
        matchesDate = issueDate >= today;
      } else if (selectedDateRange === 'yesterday') {
        const yesterday = startOfYesterday();
        matchesDate = issueDate >= yesterday && issueDate < today;
      } else if (selectedDateRange === 'week') {
        const weekAgo = startOfWeek(today);
        matchesDate = issueDate >= weekAgo;
      } else if (selectedDateRange === 'month') {
        const monthAgo = startOfMonth(today);
        matchesDate = issueDate >= monthAgo;
      }
      
      return matchesSearch && matchesStatus && matchesProject && matchesDate;
    })
    .sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())
    .slice(0, 5);
  
  const getStatusBadge = (status: IssueStatus | number) => {
    // Convert numerical status to enum if needed
    const normalizedStatus = typeof status === 'number' ? 
      status === 1 ? IssueStatus.OPEN : 
      status === 2 ? IssueStatus.IN_PROGRESS : 
      status === 3 ? IssueStatus.CLOSED : status : status;
      
    switch (normalizedStatus) {
      case IssueStatus.OPEN:
        return <Badge className="bg-construction-danger">Open</Badge>;
      case IssueStatus.IN_PROGRESS:
        return <Badge className="bg-construction-warning">In Progress</Badge>;
      case IssueStatus.CLOSED:
        return <Badge className="bg-construction-success">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getProjectName = (projectId: string | number | undefined) => {
    if (!projectId) return "Unknown Project";
    
    const project = allIssues.find(issue => 
      (issue.project?.id === projectId) || (issue.projectId === projectId)
    )?.project;

    return project?.name || "Unknown Project";
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setDateFilter(date);
    if (date) {
      setSelectedDateRange('custom');
    }
  };

  const clearDate = () => {
    setDateFilter(undefined);
    setSelectedDateRange('all');
  };
  
  const handleReportIssueClick = () => {
    navigate("/report-issue");
  };
  
  const DashboardContent = () => (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader 
        totalIssues={allIssues.length}
        openIssues={openIssues.length}
        inProgressIssues={inProgressIssues.length}
        closedIssues={closedIssues.length}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">Total Issues</h3>
          <p className="text-3xl font-bold mt-2">{allIssues.length}</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">Open Issues</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-500">{openIssues.length}</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">In Progress</h3>
          <p className="text-3xl font-bold mt-2 text-blue-500">{inProgressIssues.length}</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">Closed Issues</h3>
          <p className="text-3xl font-bold mt-2 text-green-500">{closedIssues.length}</p>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Issues</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <InputWithIcon
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-40"
              icon={<Search className="h-4 w-4" />}
            />
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-36 md:w-40">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map(projectId => {
                  const projectName = getProjectName(projectId);
                  return (
                    <SelectItem key={String(projectId)} value={String(projectId)}>
                      {projectName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-36 md:w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={IssueStatus.OPEN}>Open</SelectItem>
                <SelectItem value={IssueStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={IssueStatus.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-36 md:w-40">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-36 md:w-40 justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                {dateFilter && (
                  <div className="p-3 border-t border-border">
                    <Button variant="outline" size="sm" onClick={clearDate} className="w-full">
                      Clear date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Loading issues...
                    </TableCell>
                  </TableRow>
                ) : filteredRecentIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No issues found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecentIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{issue.title}</TableCell>
                      <TableCell>{getProjectName(issue.project?.id || issue.projectId)}</TableCell>
                      <TableCell>{issue.reported_by?.name || issue.reporterName}</TableCell>
                      <TableCell>{formatDate(issue.created_at || issue.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          asChild
                        >
                          <Link to={`/issue/${issue.id}`}>
                            <Eye size={16} />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link to="/issues">View All Issues</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // If accessed directly via /dashboard route, wrap in AppLayout
  // If accessed via Index page, don't wrap again
  return isDashboardRoute ? (
      <DashboardContent />
  ) : (
    <DashboardContent />
  );
};

export default Dashboard;
