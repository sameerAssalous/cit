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
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/dashboard";
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | "all">("all");
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
  const closedIssues = allIssues.filter(issue => issue.status === IssueStatus.CLOSED || issue.status === 4);

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
                         issue.status === 4 ? IssueStatus.CLOSED : '';

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
    const normalizedStatus = typeof status === 'number' ?
      status === 1 ? IssueStatus.OPEN :
      status === 2 ? IssueStatus.IN_PROGRESS :
      status === 4 ? IssueStatus.CLOSED : status : status;

    switch (normalizedStatus) {
      case IssueStatus.OPEN:
        return <Badge className="bg-construction-danger">{t('dashboard.open')}</Badge>;
      case IssueStatus.IN_PROGRESS:
        return <Badge className="bg-construction-warning">{t('dashboard.in_progress')}</Badge>;
      case IssueStatus.CLOSED:
        return <Badge className="bg-construction-success">{t('dashboard.closed')}</Badge>;
      default:
        return <Badge>{t('common.unknown')}</Badge>;
    }
  };

  const getProjectName = (projectId: string | number | undefined) => {
    if (!projectId) return t('common.unknown');

    const project = allIssues.find(issue =>
      (issue.project?.id === projectId) || (issue.projectId === projectId)
    )?.project;

    return project?.name || t('common.unknown');
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
          <h3 className="font-medium text-lg">{t('dashboard.total_issues')}</h3>
          <p className="text-3xl font-bold mt-2">{allIssues.length}</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">{t('dashboard.open')}</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-500">{openIssues.length}</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">{t('dashboard.in_progress')}</h3>
          <p className="text-3xl font-bold mt-2 text-blue-500">{inProgressIssues.length}</p>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="font-medium text-lg">{t('dashboard.closed')}</h3>
          <p className="text-3xl font-bold mt-2 text-green-500">{closedIssues.length}</p>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <InputWithIcon
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-40"
              icon={<Search className="h-4 w-4" />}
            />
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-36 md:w-40">
                <SelectValue placeholder={t('projects.title')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
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
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value={IssueStatus.OPEN}>{t('dashboard.open')}</SelectItem>
                <SelectItem value={IssueStatus.IN_PROGRESS}>{t('dashboard.in_progress')}</SelectItem>
                <SelectItem value={IssueStatus.CLOSED}>{t('dashboard.closed')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-36 md:w-40">
                <SelectValue placeholder={t('logs.date_range')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('logs.all_time')}</SelectItem>
                <SelectItem value="today">{t('logs.today')}</SelectItem>
                <SelectItem value="yesterday">{t('logs.yesterday')}</SelectItem>
                <SelectItem value="week">{t('logs.custom_range')}</SelectItem>
                <SelectItem value="month">{t('logs.custom_range')}</SelectItem>
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
                  {dateFilter ? format(dateFilter, "PPP") : <span>{t('logs.pick_date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">{t('common.loading')}</div>
          ) : filteredRecentIssues.length === 0 ? (
            <div className="text-center py-4">{t('dashboard.no_activity')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('issues.issue_title')}</TableHead>
                  <TableHead>{t('issues.project')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('issues.date')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecentIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>{getProjectName(issue.project?.id || issue.projectId)}</TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>{formatDate(issue.created_at || issue.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/issues/${issue.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {isDashboardRoute ? (
        <DashboardContent />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">{t('dashboard.title')}</h1>
          <DashboardContent />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
