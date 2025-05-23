import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Issue, IssueStatus, UserRole } from "@/types";
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
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfToday, startOfYesterday, startOfWeek, startOfMonth } from "date-fns";
import { formatDate } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Download, Eye, MessageSquare, Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import IssueReportModal from "@/components/issue/IssueReportModal";
import { useToast } from "@/hooks/use-toast";
import { getIssues } from "@/services/issueService";
import { useQuery } from "@tanstack/react-query";

const Issues: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isIssueReportModalOpen, setIsIssueReportModalOpen] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  
  // Fetch issues from API
  const { data: issuesResponse, isLoading, error } = useQuery({
    queryKey: ['issues', debouncedSearchQuery, selectedStatus, selectedProject, selectedDateRange],
    queryFn: () => getIssues({
      search_term: debouncedSearchQuery,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      project_id: selectedProject !== 'all' ? selectedProject : undefined,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const issues = issuesResponse?.data || [];

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading issues",
        description: "Could not load issues. Please try again.",
        variant: "destructive"
      });
      console.error("Error loading issues:", error);
    }
  }, [error, toast]);
  
  if (!user) return null;
  
  // Filter issues based on status, project and date
  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = selectedStatus !== "all" 
      ? issue.status === selectedStatus
      : true;

    const matchesProject = selectedProject !== "all" 
      ? String(issue.project?.id || issue.projectId) === selectedProject
      : true;

    // Filter by date range
    let matchesDate = true;
    const issueDate = new Date(issue.createdAt || issue.created_at);
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
      
    return matchesStatus && matchesProject && matchesDate;
  });
  
  // Get unique projects from issues
  const uniqueProjects = [...new Set(issues.map(issue => issue.project?.id || issue.projectId))];
  
  const getStatusBadge = (status: IssueStatus | number) => {
    // Convert numerical status to enum if needed
    const normalizedStatus = typeof status === 'number' ? 
      status === 1 ? IssueStatus.OPEN : 
      status === 2 ? IssueStatus.IN_PROGRESS : 
      status === 4 ? IssueStatus.CLOSED : IssueStatus.OPEN : status;
      
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
    setIsIssueReportModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className="text-gray-600">Track and manage construction issues</p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          onClick={handleReportIssueClick}
        >
          <Plus size={16} />
          <span>Report Issue</span>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div>
              <InputWithIcon
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={String(IssueStatus.OPEN)}>Open</SelectItem>
                  <SelectItem value={String(IssueStatus.IN_PROGRESS)}>In Progress</SelectItem>
                  <SelectItem value={String(IssueStatus.CLOSED)}>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map(projectId => {
                    const project = issues.find(issue => 
                      (issue.project?.id === projectId) || (issue.projectId === projectId)
                    )?.project;
                    const projectName = project?.name || "Unknown Project";
                    return (
                      <SelectItem key={String(projectId)} value={String(projectId)}>
                        {projectName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Issue List</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Loading issues...
                    </TableCell>
                  </TableRow>
                ) : filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No issues found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{issue.title}</TableCell>
                      <TableCell>{issue.project?.name || "Unknown Project"}</TableCell>
                      <TableCell>{issue.reported_by?.name || issue.reporterName || "Unknown"}</TableCell>
                      <TableCell>{formatDate(issue.created_at || issue.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          <span>{issue.comments?.length || 0}</span>
                        </div>
                      </TableCell>
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
        </CardContent>
      </Card>

      {/* Issue Report Modal */}
      <IssueReportModal
        isOpen={isIssueReportModalOpen}
        onClose={() => setIsIssueReportModalOpen(false)}
        initialProjectId={undefined}
      />
    </div>
  );
};

export default Issues;
