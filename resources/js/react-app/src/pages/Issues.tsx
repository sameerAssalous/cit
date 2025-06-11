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
import { useTranslation } from "react-i18next";

const Issues: React.FC = () => {
  const { t } = useTranslation();
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
        title: t('issues.error_loading_title'),
        description: t('issues.error_loading_description'),
        variant: "destructive"
      });
      console.error("Error loading issues:", error);
    }
  }, [error, toast, t]);
  
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
    const normalizedStatus = typeof status === 'number' ? 
      status === 1 ? IssueStatus.OPEN : 
      status === 2 ? IssueStatus.IN_PROGRESS : 
      status === 4 ? IssueStatus.CLOSED : IssueStatus.OPEN : status;
      
    switch (normalizedStatus) {
      case IssueStatus.OPEN:
        return <Badge className="bg-construction-danger">{t('issues.status.open')}</Badge>;
      case IssueStatus.IN_PROGRESS:
        return <Badge className="bg-construction-warning">{t('issues.status.in_progress')}</Badge>;
      case IssueStatus.CLOSED:
        return <Badge className="bg-construction-success">{t('issues.status.closed')}</Badge>;
      default:
        return <Badge>{t('issues.status.unknown')}</Badge>;
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
          <h1 className="text-3xl font-bold">{t('issues.title')}</h1>
          <p className="text-gray-600">{t('issues.description')}</p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          onClick={handleReportIssueClick}
        >
          <Plus size={16} />
          <span>{t('issues.report_issue')}</span>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">{t('issues.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div>
              <InputWithIcon
                placeholder={t('issues.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('issues.filter_by_status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('issues.status.all')}</SelectItem>
                  <SelectItem value={IssueStatus.OPEN}>{t('issues.status.open')}</SelectItem>
                  <SelectItem value={IssueStatus.IN_PROGRESS}>{t('issues.status.in_progress')}</SelectItem>
                  <SelectItem value={IssueStatus.CLOSED}>{t('issues.status.closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder={t('issues.filter_by_project')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('issues.projects.all')}</SelectItem>
                  {uniqueProjects.map((projectId) => (
                    <SelectItem key={projectId} value={String(projectId)}>
                      {issues.find(issue => String(issue.project?.id || issue.projectId) === String(projectId))?.project?.name || t('issues.unknown_project')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('issues.filter_by_date')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('issues.date.all')}</SelectItem>
                  <SelectItem value="today">{t('issues.date.today')}</SelectItem>
                  <SelectItem value="yesterday">{t('issues.date.yesterday')}</SelectItem>
                  <SelectItem value="week">{t('issues.date.this_week')}</SelectItem>
                  <SelectItem value="month">{t('issues.date.this_month')}</SelectItem>
                  <SelectItem value="custom">{t('issues.date.custom')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedDateRange === 'custom' && (
            <div className="mt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : t('issues.select_date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={clearDate}
                >
                  {t('issues.clear_date')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('issues.table.title')}</TableHead>
                  <TableHead>{t('issues.table.project')}</TableHead>
                  <TableHead>{t('issues.table.reporter')}</TableHead>
                  <TableHead>{t('issues.table.date')}</TableHead>
                  <TableHead>{t('issues.table.status')}</TableHead>
                  <TableHead className="text-right">{t('issues.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('issues.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('issues.no_issues_found')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={String(issue.id)}>
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {issue.title}
                      </TableCell>
                      <TableCell>
                        {issue.project?.name || t('issues.unknown_project')}
                      </TableCell>
                      <TableCell>
                        {issue.reporterName || t('issues.unknown_reporter')}
                      </TableCell>
                      <TableCell>{formatDate(issue.createdAt || issue.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/issues/${String(issue.id)}`}>
                              <Eye size={16} />
                              <span className="sr-only">{t('issues.view_details')}</span>
                            </Link>
                          </Button>
                          {issue.comments && issue.comments.length > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              {issue.comments.length}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <IssueReportModal
        isOpen={isIssueReportModalOpen}
        onClose={() => setIsIssueReportModalOpen(false)}
      />
    </div>
  );
};

export default Issues;
