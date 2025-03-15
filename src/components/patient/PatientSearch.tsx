import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientSearchProps {
  onSearch?: (searchParams: PatientSearchParams) => void;
  className?: string;
}

interface PatientSearchParams {
  query: string;
  filters: {
    status: string;
    department: string;
    dateRange: string;
  };
}

const PatientSearch = ({ onSearch, className = "" }: PatientSearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    query: "",
    filters: {
      status: "all",
      department: "all",
      dateRange: "all",
    },
  });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      query: e.target.value,
    });
  };

  const handleFilterChange = (
    key: keyof typeof searchParams.filters,
    value: string,
  ) => {
    setSearchParams({
      ...searchParams,
      filters: {
        ...searchParams.filters,
        [key]: value,
      },
    });
  };

  const clearFilters = () => {
    setSearchParams({
      ...searchParams,
      filters: {
        status: "all",
        department: "all",
        dateRange: "all",
      },
    });
  };

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm ${className}`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients by name, ID, phone number..."
              value={searchParams.query}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="whitespace-nowrap">
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Status</label>
              <Select
                value={searchParams.filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={searchParams.filters.department}
                onValueChange={(value) =>
                  handleFilterChange("department", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="oncology">Oncology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select
                value={searchParams.filters.dateRange}
                onValueChange={(value) =>
                  handleFilterChange("dateRange", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSearch;
