import React, { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Logs, Filter, User, Calendar } from "lucide-react";
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { useToast } from "@/components/ui/use-toast";

// Define the log entry type
interface LogEntry {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  model_type: string;
  model_id: number;
  info: Record<string, any>;
  created_at: string;
}

// API response type
interface LogsResponse {
  data: LogEntry[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Define the filter type
type FilterType = {
  userName: string;
  action: string;
  affected: string;
  searchTerm: string;
  dateRange: {
    type: 'all' | 'today' | 'yesterday' | 'custom';
    from: Date | null;
    to: Date | null;
  };
}

// Function to fetch logs
const fetchLogs = async (searchTerm = '') => {
  const response = await apiClient.get(`/tracking${searchTerm ? `?search_term=${searchTerm}` : ''}`);
  return response.data;
};

const LogsPage: React.FC = () => {
  const { toast } = useToast();
  
  // Filter state
  const [filters, setFilters] = useState<FilterType>({
    userName: 'all',
    action: 'all',
    affected: '',
    searchTerm: '',
    dateRange: {
      type: 'all',
      from: null,
      to: null
    }
  });

  // State to track which rows have expanded JSON info
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Fetch logs from API
  const { data: logsResponse, isLoading, error } = useQuery<LogsResponse>({
    queryKey: ['logs', filters.searchTerm],
    queryFn: () => fetchLogs(filters.searchTerm),
    onError: (error) => {
      toast({
        title: "Error fetching logs",
        description: `Failed to load logs: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  const logs = logsResponse?.data || [];

  // Toggle expanded state for a row
  const toggleExpand = (id: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Extract unique values for select filters
  const uniqueUserNames = useMemo(() => 
    Array.from(new Set(logs.map(log => log.user_name || 'Unknown User'))),
    [logs]
  );

  const uniqueActions = useMemo(() => 
    Array.from(new Set(logs.map(log => log.action))),
    [logs]
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterType, value: any) => {
    if (key === 'dateRange') {
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          ...value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      userName: 'all',
      action: 'all',
      affected: '',
      searchTerm: '',
      dateRange: {
        type: 'all',
        from: null,
        to: null
      }
    });
  };

  // Handle search
  const handleSearch = () => {
    // Update the searchTerm which will trigger a new API call
    const { affected, userName, action } = filters;
    let searchTerm = '';
    
    if (affected) searchTerm = affected;
    if (userName !== 'all') searchTerm = userName;
    if (action !== 'all') searchTerm = action;
    
    setFilters(prev => ({
      ...prev,
      searchTerm
    }));
  };

  // Apply local filters to logs from API
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Filter by user name
      if (filters.userName !== 'all' && log.user_name !== filters.userName) {
        return false;
      }

      // Filter by action
      if (filters.action !== 'all' && log.action !== filters.action) {
        return false;
      }

      // Filter by affected object
      if (filters.affected && !log.model_type.toLowerCase().includes(filters.affected.toLowerCase())) {
        return false;
      }

      // Filter by date range
      const logDate = parseISO(log.created_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filters.dateRange.type === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return isAfter(logDate, today) && isBefore(logDate, tomorrow);
      } 
      else if (filters.dateRange.type === 'yesterday') {
        const yesterday = subDays(today, 1);
        return isAfter(logDate, yesterday) && isBefore(logDate, today);
      }
      else if (filters.dateRange.type === 'custom') {
        const fromDate = filters.dateRange.from;
        const toDate = filters.dateRange.to;
        
        if (fromDate && toDate) {
          const fromWithTime = new Date(fromDate);
          fromWithTime.setHours(0, 0, 0, 0);
          
          const toWithTime = new Date(toDate);
          toWithTime.setHours(23, 59, 59, 999);
          
          return isAfter(logDate, fromWithTime) && isBefore(logDate, toWithTime);
        }
        else if (fromDate) {
          const fromWithTime = new Date(fromDate);
          fromWithTime.setHours(0, 0, 0, 0);
          return isAfter(logDate, fromWithTime);
        }
        else if (toDate) {
          const toWithTime = new Date(toDate);
          toWithTime.setHours(23, 59, 59, 999);
          return isBefore(logDate, toWithTime);
        }
      }
      
      // No date filter or all dates
      return true;
    });
  }, [logs, filters]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Logs className="h-8 w-8" />
          System Logs
        </h1>
      </div>

      {/* Filter section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* User filter */}
            <div className="space-y-2">
              <Label htmlFor="userName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                User Name
              </Label>
              <Select
                value={filters.userName}
                onValueChange={(value) => handleFilterChange('userName', value)}
              >
                <SelectTrigger id="userName">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUserNames.map((name: string) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action filter */}
            <div className="space-y-2">
              <Label htmlFor="action">Action Type</Label>
              <Select
                value={filters.action}
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger id="action">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action: string) => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Affected object filter */}
            <div className="space-y-2">
              <Label htmlFor="affected">Affected Object</Label>
              <Input
                id="affected"
                placeholder="Search affected objects"
                value={filters.affected}
                onChange={(e) => handleFilterChange('affected', e.target.value)}
              />
            </div>

            {/* Date range filter */}
            <div className="space-y-2">
              <Label htmlFor="dateRange" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Label>
              <Select
                value={filters.dateRange.type}
                onValueChange={(value: 'all' | 'today' | 'yesterday' | 'custom') => 
                  handleFilterChange('dateRange', { type: value })
                }
              >
                <SelectTrigger id="dateRange">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom date range selector - only shown when 'custom' is selected */}
          {filters.dateRange.type === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* From date */}
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={(date) => handleFilterChange('dateRange', { from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To date */}
              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={(date) => handleFilterChange('dateRange', { to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Filter actions */}
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
            <Button className="flex items-center gap-2" onClick={handleSearch}>
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>A log of all administrative actions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Affected</TableHead>
              <TableHead>Info</TableHead>
              <TableHead>Happened At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-red-500">
                  Error loading logs. Please try again.
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No logs match your filters. Try adjusting your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user_name || 'Unknown User'}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.model_type}</TableCell>
                  <TableCell>
                    <Collapsible
                      open={expandedRows[log.id]}
                      onOpenChange={() => toggleExpand(log.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                          {expandedRows[log.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                        <pre className="whitespace-pre-wrap break-all">
                          {JSON.stringify(log.info, null, 2)}
                        </pre>
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LogsPage;
